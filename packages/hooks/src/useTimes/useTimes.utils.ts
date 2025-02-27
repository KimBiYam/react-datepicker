import {addMinutes, startOfDay, isAfter, isBefore, isEqual, format} from 'date-fns'
import {TimeType, Time} from './useTimes'

export interface GetTimeProps {
  minTime?: Time
  maxTime?: Time
  minutesStep?: number
  timeLabelFormat?: (date: Date) => string
}

export function getTimes({
  minTime,
  maxTime,
  minutesStep = 5,
  timeLabelFormat = (date: Date) => format(date, 'HH:mm:ss'),
}: GetTimeProps) {
  const base = startOfDay(new Date())

  const multiplier = (60 * 24) / minutesStep

  const times = Array.from({length: multiplier}).map((_, index) =>
    addMinutes(base, index * minutesStep),
  )

  return times.map(date => getTime({date, minTime, maxTime, timeLabelFormat}))
}

function getTime({
  date,
  minTime,
  maxTime,
  timeLabelFormat,
}: {
  date: Date
  minTime?: Time
  maxTime?: Time
  timeLabelFormat: (date: Date) => string
}): TimeType {
  const minTimeDate = new Date()
  if (minTime) {
    minTimeDate.setHours(minTime?.hours ?? 0)
    minTimeDate.setMinutes(minTime?.minuets ?? 0)
    minTimeDate.setSeconds(minTime?.seconds ?? 0)
  }

  const maxTimeDate = new Date()
  if (maxTime) {
    minTimeDate.setHours(maxTime?.hours ?? 23)
    minTimeDate.setMinutes(maxTime?.minuets ?? 59)
    minTimeDate.setSeconds(maxTime?.seconds ?? 59)
  }

  const isBeforeMinTime = minTime
    ? isEqual(date, minTimeDate) || isBefore(date, minTimeDate)
    : false
  const isAfterMaxTime = maxTime ? isEqual(date, maxTimeDate) || isAfter(date, maxTimeDate) : false

  return {
    timeLabel: timeLabelFormat(date),
    disabled: isBeforeMinTime || isAfterMaxTime,
    hours: date.getHours(),
    minuets: date.getMinutes(),
    seconds: date.getSeconds(),
  }
}
