import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | LocalConnect',
  description: 'Our privacy policy and data collection practices.',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-extrabold mb-8">Privacy Policy</h1>
      <p className="text-muted-foreground mb-8">Last Updated: October 4, 2026</p>
      
      <div className="prose dark:prose-invert max-w-none space-y-6 text-lg leading-relaxed text-muted-foreground">
        <p>At LocalConnect, accessible from localconnect.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by LocalConnect and how we use it.</p>
        
        <h2 className="text-2xl font-bold text-foreground mt-8">Information We Collect</h2>
        <p>The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.</p>
        <p>If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.</p>

        <h2 className="text-2xl font-bold text-foreground mt-8">Log Files and Cookies</h2>
        <p>LocalConnect follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.</p>
        <p>Like any other website, LocalConnect uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>

        <h2 className="text-2xl font-bold text-foreground mt-8">Google DoubleClick DART Cookie & Third-Party Ad Vendors</h2>
        <p>Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy.</p>
        <p>Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on LocalConnect, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.</p>
        <p>Note that LocalConnect has no access to or control over these cookies that are used by third-party advertisers.</p>

        <h2 className="text-2xl font-bold text-foreground mt-8">CCPA and GDPR Privacy Rights</h2>
        <p>We respect your privacy rights under applicable laws. If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.</p>
      </div>
    </div>
  );
}
