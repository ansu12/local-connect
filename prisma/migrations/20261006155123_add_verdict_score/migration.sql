-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Listing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "rating" REAL NOT NULL DEFAULT 0.0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "priceRange" TEXT,
    "yearFounded" INTEGER,
    "lastVerifiedAt" DATETIME,
    "verdictScore" REAL NOT NULL DEFAULT 0.0,
    "specialties" TEXT NOT NULL,
    "source" TEXT,
    "cityId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    CONSTRAINT "Listing_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Listing_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Listing" ("address", "cityId", "id", "lastVerifiedAt", "name", "phone", "priceRange", "rating", "reviewCount", "serviceId", "slug", "source", "specialties", "website", "yearFounded") SELECT "address", "cityId", "id", "lastVerifiedAt", "name", "phone", "priceRange", "rating", "reviewCount", "serviceId", "slug", "source", "specialties", "website", "yearFounded" FROM "Listing";
DROP TABLE "Listing";
ALTER TABLE "new_Listing" RENAME TO "Listing";
CREATE UNIQUE INDEX "Listing_slug_key" ON "Listing"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
