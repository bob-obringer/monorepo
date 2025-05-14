import Link from "next/link";
import { H1, H2, P } from "@bob-obringer/design-system";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <H1 className="mb-2">
          Welcome to the Admin Dashboard
        </H1>
        <P color="subtle" className="max-w-2xl mx-auto">
          Select a section from the sidebar to manage your site content.
        </P>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Link 
          href="/admin/chats"
          className="block p-6 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <H2 className="mb-2">
                Chat Archives
              </H2>
              <P color="subtle">
                View and manage archived chat conversations
              </P>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 text-primary" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
                />
              </svg>
            </div>
          </div>
        </Link>
        
        {/* Placeholder for future admin sections */}
        <div className="block p-6 bg-muted rounded-lg border border-dashed border-border">
          <div className="flex items-center justify-between">
            <div>
              <H2 color="subtle" className="mb-2">
                Coming Soon
              </H2>
              <P color="faint">
                Additional admin features will be added here
              </P>
            </div>
            <div className="bg-muted-foreground/10 p-3 rounded-full">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 text-muted-foreground" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
