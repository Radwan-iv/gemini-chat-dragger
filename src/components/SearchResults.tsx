import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface SearchResult {
  title: string;
  url: string;
  description: string;
  imageUrl?: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
}

export const SearchResults = ({ results, isLoading }: SearchResultsProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-20 bg-muted" />
            <CardContent className="h-32 bg-muted" />
          </Card>
        ))}
      </div>
    );
  }

  if (!results.length) return null;

  return (
    <div className="space-y-4 mb-8">
      {results.map((result, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <a href={result.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                {result.title}
                <ExternalLink className="inline-block ml-2 h-4 w-4" />
              </a>
            </CardTitle>
            <CardDescription>{result.url}</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            {result.imageUrl && (
              <img src={result.imageUrl} alt={result.title} className="w-32 h-32 object-cover rounded-md" />
            )}
            <p className="text-sm text-muted-foreground">{result.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};