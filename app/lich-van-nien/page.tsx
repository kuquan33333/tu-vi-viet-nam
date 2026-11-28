import CalendarView from './CalendarView';
import {buildCalendarYear} from '@/lib/ziwei/calendar-display-server';
import {vietnamToday} from '@/lib/ziwei/calendar-display';

export default function CalendarPage(){
 const initial=vietnamToday();
 const years=[initial.year-1,initial.year,initial.year+1].filter(y=>y>=1900&&y<=2050);
 const initialData=Object.fromEntries(years.map(year=>[year,buildCalendarYear(year)]));
 return <CalendarView initialData={initialData} initial={initial}/>;
}
