import {writeFileSync} from 'node:fs';
import {buildCalendarData} from '../lib/ziwei/calendar-display-server';

const data=buildCalendarData();
writeFileSync('public/calendar-data.json',JSON.stringify(data));
console.log('Generated static calendar data: '+Object.keys(data).length+' years');
