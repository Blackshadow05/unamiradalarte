import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';

interface EventCardProps {
  title: string;
  description: string;
  date: string;
  location: string;
}

export function EventCard({ title, description, date, location }: EventCardProps) {
  return (
    <Card>
      <CardHeader>{title}</CardHeader>
      <CardContent>{description}</CardContent>
      <CardFooter>
        <div>{date}</div>
        <div>{location}</div>
      </CardFooter>
    </Card>
  );
}