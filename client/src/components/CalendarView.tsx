import { useState, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Clock, CheckCircle, AlertCircle, Calendar as CalendarIcon } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  status: string;
  content: string;
  userId: number;
  platforms: string[];
  resource: string;
}

interface CalendarViewProps {
  onCreatePost?: (date?: Date) => void;
  selectedClientId?: number;
}

export default function CalendarView({ onCreatePost, selectedClientId }: CalendarViewProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Calculate date range for API call
  const { startDate, endDate } = useMemo(() => {
    const start = moment(currentDate).startOf('month').subtract(1, 'week');
    const end = moment(currentDate).endOf('month').add(1, 'week');
    return {
      startDate: start.toDate(),
      endDate: end.toDate()
    };
  }, [currentDate]);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['/api/calendar/posts', startDate.toISOString(), endDate.toISOString()],
    queryFn: () => apiRequest(`/api/calendar/posts?start=${startDate.toISOString()}&end=${endDate.toISOString()}`).then(res => res.json()),
    select: (data) => data.map((event: any) => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end)
    }))
  });

  // Filter events by selected client if specified
  const filteredEvents = useMemo(() => {
    if (!selectedClientId || selectedClientId === 0) return events;
    return events.filter((event: CalendarEvent) => event.userId === selectedClientId);
  }, [events, selectedClientId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'posted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending_approval':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="w-3 h-3" />;
      case 'posted':
        return <CheckCircle className="w-3 h-3" />;
      case 'pending_approval':
      case 'approved':
        return <AlertCircle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#3174ad';
    
    switch (event.status) {
      case 'scheduled':
        backgroundColor = '#3b82f6';
        break;
      case 'posted':
        backgroundColor = '#10b981';
        break;
      case 'pending_approval':
        backgroundColor = '#f59e0b';
        break;
      case 'approved':
        backgroundColor = '#8b5cf6';
        break;
      case 'rejected':
        backgroundColor = '#ef4444';
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  const handleSelectSlot = ({ start }: { start: Date }) => {
    if (onCreatePost) {
      onCreatePost(start);
    }
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Content Calendar</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Scheduled</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Posted</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Pending</span>
            </div>
          </div>
          {onCreatePost && (
            <Button 
              onClick={() => onCreatePost()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          )}
        </div>
      </div>

      {/* Calendar */}
      <Card>
        <CardContent className="p-6">
          <div style={{ height: '600px' }}>
            <Calendar
              localizer={localizer}
              events={filteredEvents}
              startAccessor="start"
              endAccessor="end"
              titleAccessor="title"
              allDayAccessor={() => false}
              step={60}
              showMultiDayTimes
              defaultView="month"
              views={['month', 'week', 'day']}
              eventPropGetter={eventStyleGetter}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              selectable
              popup
              date={currentDate}
              onNavigate={(date) => setCurrentDate(date)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Event Details Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedEvent && getStatusIcon(selectedEvent.status)}
              {selectedEvent?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <Badge className={getStatusColor(selectedEvent.status)}>
                  {selectedEvent.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-1">Content</h4>
                <p className="text-sm text-gray-600">{selectedEvent.content}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-1">Scheduled Time</h4>
                <p className="text-sm text-gray-600">
                  {moment(selectedEvent.start).format('MMMM D, YYYY [at] h:mm A')}
                </p>
              </div>
              
              {selectedEvent.platforms && selectedEvent.platforms.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-1">Platforms</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedEvent.platforms.map((platform, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2 pt-4">
                <Button size="sm" variant="outline" className="flex-1">
                  Edit Post
                </Button>
                <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  View Details
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}