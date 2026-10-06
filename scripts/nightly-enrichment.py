import sqlite3
import asyncio
import os
import json
from datetime import datetime, timedelta
from google.antigravity import Agent, LocalAgentConfig, types

def get_listings_to_enrich():
    conn = sqlite3.connect('prisma/dev.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    # Calculate 7 days ago
    seven_days_ago = (datetime.utcnow() - timedelta(days=7)).isoformat()
    
    c.execute("""
        SELECT id, name, address, website 
        FROM Listing 
        WHERE lastEnrichedAt IS NULL OR lastEnrichedAt < ?
        LIMIT 20
    """, (seven_days_ago,))
    
    rows = c.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def update_listings(results_list):
    conn = sqlite3.connect('prisma/dev.db')
    c = conn.cursor()
    # Prisma DateTime fields are ISO8601 strings in SQLite (e.g., '2023-01-01T00:00:00.000Z')
    # or unix timestamps depending on the client. Prisma stores them as numeric or ISO string.
    # Prisma uses numeric timestamp (epoch in ms) by default for SQLite DateTime fields under the hood?
    # No, Prisma stores DateTime in SQLite as a numeric value (unix timestamp in milliseconds).
    now = int(datetime.utcnow().timestamp() * 1000)
    
    for item in results_list:
        spec = ",".join(item.get("specialties", []))
        c.execute("""
            UPDATE Listing 
            SET specialties = ?, lastEnrichedAt = ? 
            WHERE id = ?
        """, (spec, now, item["id"]))
    
    conn.commit()
    conn.close()

async def main():
    print("Starting AGY Python SDK Enrichment...")
    listings = get_listings_to_enrich()
    
    if not listings:
        print("No listings to enrich.")
        return
        
    print(f"Found {len(listings)} listings to enrich.")
    
    # Define the enrichment subagent
    enricher = types.SubagentConfig(
        name="listing-enricher",
        description="Researches a local business and extracts structured attributes.",
        system_instructions="""
        Research the given business and return a JSON object with:
        specialties, certifications, differentiators, payment_options, languages.
        Only include verifiable attributes. Use tools if necessary.
        """,
        tools=["run_command", "grep_search"],
        model="flash",
    )

    config = LocalAgentConfig(
        capabilities=types.CapabilitiesConfig(enable_subagents=True),
        subagents=[enricher]
    )

    # Format the prompt
    prompt = "Spawn a 'listing-enricher' subagent for each of these listings in parallel to research them. Combine all their findings into a single JSON array where each object has 'id', 'specialties', 'certifications', 'differentiators', 'payment_options', 'languages'. Do not return any other text outside of the JSON array.\n\nListings:\n"
    for l in listings:
        prompt += f"ID: {l['id']} | Name: {l['name']} | Address: {l['address']} | Web: {l['website']}\n"

    async with Agent(config) as agent:
        response = await agent.chat(prompt)
        text = await response.text()
        
        # Parse JSON
        try:
            clean_text = text.strip()
            if clean_text.startswith("```json"):
                clean_text = clean_text[7:-3]
            elif clean_text.startswith("```"):
                clean_text = clean_text[3:-3]
                
            data = json.loads(clean_text)
            update_listings(data)
            
            log_dir = "logs"
            if not os.path.exists(log_dir):
                os.makedirs(log_dir)
            
            log_file = os.path.join(log_dir, f"enrichment-batch-{datetime.now().strftime('%Y%m%d%H%M%S')}.json")
            with open(log_file, "w") as f:
                json.dump(data, f, indent=2)
                
            print(f"Successfully enriched {len(data)} listings. Log saved to {log_file}")
            
        except Exception as e:
            print(f"Failed to parse or update results: {e}\nRaw output: {text}")

if __name__ == "__main__":
    asyncio.run(main())
