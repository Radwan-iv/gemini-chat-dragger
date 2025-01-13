import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const exampleMessages = [
  {
    heading: 'Who is NCTU Petrolume Tech Team?',
    message: 'Who is NCTU Petrolume Tech Team?'
  },
  {
    heading: 'What is sucker rod pump component?',
    message: 'What is sucker rod pump component?'
  },
  {
    heading: 'New Cairo Technological University',
    message: 'New Cairo Technological University'
  },
  {
    heading: 'Summary: https://www.everand.com/read/524001512/Hydrogen',
    message: 'Summary: https://www.everand.com/read/524001512/Hydrogen'
  }
]
export function EmptyScreen({
  submitMessage,
  className
}: {
  submitMessage: (message: string) => void
  className?: string
}) {
  return (
    <div className={`mx-auto w-full transition-all ${className}`}>
      <div className="bg-background p-2">
        <div className="mt-4 flex flex-col items-start space-y-2 mb-4">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              name={message.message}
              onClick={async () => {
                submitMessage(message.message)
              }}
            >
              <ArrowRight size={16} className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
