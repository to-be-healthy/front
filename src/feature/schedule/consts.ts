const SCHEDULE_ACTIVE_COLORS = [
  {
    bg: '#FFE4E5',
    border: '#FF7C80',
  },
  {
    bg: '#FFEFC7',
    border: '#FFC83B',
  },
  {
    bg: '#E2F3FF',
    border: '#70BAFF',
  },
  {
    bg: '#E5E3FF',
    border: '#9175FF',
  },
  {
    bg: '#FDE8FF',
    border: '#E57FFE',
  },
];

const SCHEDULE_AVAILABLE_COLOR = {
  bg: '#fff',
  border: 'transparent',
};

const SCHEDULE_DISABLED_COLORS = {
  bg: 'transparent',
  border: 'transparent',
};

const SCHEDULE_NOSHOW_COLOR = {
  bg: '#F2F3F5',
  border: '#A7A9AE',
};

const CLASS_TIME_DEFAULT = {
  lessonStartTime: '10:00',
  lessonEndTime: '20:00',
  lunchStartTime: '12:00',
  lunchEndTime: '13:00',
  lessonTime: 60,
  closedDays: [],
};
export {
  CLASS_TIME_DEFAULT,
  SCHEDULE_ACTIVE_COLORS,
  SCHEDULE_AVAILABLE_COLOR,
  SCHEDULE_DISABLED_COLORS,
  SCHEDULE_NOSHOW_COLOR,
};
