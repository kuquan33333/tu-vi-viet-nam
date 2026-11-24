import CalendarView from './CalendarView';
import {buildCalendarData} from '@/lib/ziwei/calendar-display-server';
import {vietnamToday} from '@/lib/ziwei/calendar-display';
export default function CalendarPage(){return <CalendarView data={buildCalendarData()} initial={vietnamToday()}/>;}
