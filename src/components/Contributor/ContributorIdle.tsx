import { Database } from 'lucide-react'


// This is a deprecated component. I liked it, I kept it.
const ContributorIdle = () => {
  return (
    <div className="text-center py-12 space-y-2">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Database className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-medium">Ready to Contribute?</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
            Click the button below to connect to join scrapper network for this institute.
        </p>
    </div>
  )
}

export default ContributorIdle;
