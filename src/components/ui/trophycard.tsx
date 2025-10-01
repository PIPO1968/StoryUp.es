import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy } from '@/lib/types';

interface TrophyCardProps {
    trophy: Trophy;
}

export function TrophyCard({ trophy }: TrophyCardProps) {
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border-2 border-gray-200">
                        <img
                            src={trophy.icon}
                            alt={trophy.name}
                            className="w-10 h-10 object-contain"
                        />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-sm">{trophy.name}</h3>
                        <p className="text-xs text-muted-foreground mb-1">{trophy.description}</p>
                        <Badge variant="outline" className="text-xs">
                            {formatDate(trophy.earnedAt)}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}