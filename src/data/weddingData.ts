/**
 * 모바일 청첩장 콘텐츠 데이터
 * 텍스트, 사진 경로, 스토리, 안내 문구를 이곳에서 손쉽게 수정할 수 있습니다.
 */

export interface TimelineItem {
  time: string;
  titleEn: string;
  descriptionKr: string;
}

export interface LoveStoryItem {
  id: string;
  dateLabel: string;
  titleKr: string;
  storyKr: string;
}

export interface AccountInfo {
  role: string;
  holder: string;
  bank: string;
  number: string;
}

export interface QnaItem {
  id: string;
  question: string;
  answer: string;
  subDetails?: string[];
  accounts?: AccountInfo[];
}

export const WEDDING_INFO = {
  /**
   * 폴라로이드 사진 경로:
   * public 폴더에 이미지를 넣은 뒤 '/my-photo.jpg' 형태로 경로만 교체하면 바로 반영됩니다.
   */
  polaroidImageSrc: '/couple-snap-placeholder.svg',
  polaroidImageAlt: '신랑 김재현과 신부 정하은의 웨딩 스냅',
  polaroidDateLabel: '05/29/2027',

  kickerTop: 'WE JOYFULLY INVITE YOU TO OUR WEDDING',
  coupleNameEn: 'Jaehyun & Haeun',
  groomNameKr: '김재현',
  brideNameKr: '정하은',
  coupleSubtitleKr: '신랑 김재현 · 신부 정하은',
  locationCaptionTop: 'WEDDING GROUP WITHUS YEONGDEUNGPO / SEOUL',

  // 예식 일시 (2027년 5월 29일 오후 2시, 한국 표준시)
  ceremonyIsoDate: '2027-05-29T14:00:00+09:00',
  ceremonyEndIsoDate: '2027-05-29T16:00:00+09:00',
  ceremonyDateEn: 'May 29, 2027',
  rsvpDeadlineEn: 'Kindly respond by May 15, 2027',

  venue: {
    titleEn: 'Wedding Group Withus',
    nameKr: '웨딩그룹위더스 영등포',
    addressKr: '서울 영등포구 영등포로 109',
    hallDetailKr: '9층 아모르홀',
    lat: 37.5197,
    lng: 126.9048,
    naverMapUrl:
      'https://map.naver.com/v5/search/%EC%9B%A8%EB%94%A9%EA%B7%B8%EB%A3%B9%EC%9C%84%EB%8D%94%EC%8A%A4%20%EC%98%81%EB%93%B1%ED%8F%AC',
    kakaoMapUrl:
      'https://map.kakao.com/link/search/%EC%9B%A8%EB%94%A9%EA%B7%B8%EB%A3%B9%EC%9C%84%EB%8D%94%EC%8A%A4%20%EC%98%81%EB%93%B1%ED%8F%AC',
    googleMapUrl:
      'https://www.google.com/maps/search/?api=1&query=%EC%84%9C%EC%9A%B8+%EC%98%81%EB%93%B1%ED%8F%AC%EA%B5%AC+%EC%98%81%EB%93%B1%ED%8F%AC%EB%A1%9C+109',
  },
} as const;

export const TIMELINE_ITEMS: TimelineItem[] = [
  {
    time: '13:30',
    titleEn: 'GREETING',
    descriptionKr: '하객 맞이 및 포토테이블 안내',
  },
  {
    time: '14:00',
    titleEn: 'CEREMONY',
    descriptionKr: '본식 예식 시작',
  },
  {
    time: '14:30',
    titleEn: 'DINNER & RECEPTION',
    descriptionKr: '피로연 및 식사',
  },
];

/**
 * 러브 스토리 데이터 배열 — 텍스트와 날짜를 자유롭게 수정해 주세요.
 */
export const LOVE_STORY_ITEMS: LoveStoryItem[] = [
  {
    id: 'first-meeting',
    dateLabel: 'October 2022',
    titleKr: '서촌의 작은 책방에서 마주친 첫인사',
    storyKr:
      '가을비가 잦아들던 토요일 오후, 우연히 같은 시집을 집어 들며 시작된 짧은 대화가 어느새 세 시간의 따뜻한 산책으로 이어졌습니다.',
  },
  {
    id: 'beginning',
    dateLabel: 'Spring 2023',
    titleKr: '같은 계절을 나란히 걷기 시작한 날',
    storyKr:
      '윤슬이 반짝이던 여의도 공원의 밤, 조금은 서툴지만 진심을 담은 고백과 함께 서로의 평범한 일상 속에 가장 든든한 편이 되어주기로 했습니다.',
  },
  {
    id: 'proposal',
    dateLabel: 'Autumn 2026',
    titleKr: '평생을 함께 그리기로 약속한 순간',
    storyKr:
      '사계절을 네 번 함께 건너며 닮아간 두 사람이 이제 부부라는 이름으로 새로운 계절을 맞이하려 합니다. 귀한 걸음으로 축복해 주시면 감사하겠습니다.',
  },
];

export const QNA_ITEMS: QnaItem[] = [
  {
    id: 'parking',
    question: '주차 안내',
    answer:
      '웨딩그룹위더스 영등포 건물 내 지하 주차장을 이용하실 수 있으며, 하객분들께는 2시간 무료 주차가 지원됩니다.',
    subDetails: [
      '예식 당일 주차 공간이 혼잡할 수 있으니 안내 요원의 유도를 따라 이용해 주세요.',
      '만차 시 인근 공영주차장(영등포동 제1·제2 공영주차장) 이용 및 주차권 안내가 제공됩니다.',
    ],
  },
  {
    id: 'transit',
    question: '대중교통 안내',
    answer:
      '지하철 1호선 영등포역 및 5호선 영등포시장역에서 도보로 편리하게 오실 수 있습니다.',
    subDetails: [
      '1호선 영등포역 5번 출구 도보 약 5분 (영등포 로터리 방면 직진)',
      '5호선 영등포시장역 3번 출구 도보 약 5분',
      '버스 이용 시 "영등포시장" 또는 "영등포역" 정류장 하차',
    ],
  },
  {
    id: 'dining',
    question: '식사 및 연회장 안내',
    answer:
      '정성스럽게 준비한 연회 식사는 본식 시작 30분 전인 오후 1시 30분부터 이용하실 수 있습니다.',
    subDetails: [
      '연회장은 예식 홀과 같은 동선으로 편리하게 이동하실 수 있습니다.',
      '어린 자녀를 동반하신 하객분들을 위해 유아용 하이체어가 준비되어 있습니다.',
    ],
  },
  {
    id: 'wreath-and-gift',
    question: '축하 화환 및 마음 전하실 곳',
    answer:
      '축하해 주시는 따뜻한 마음만으로도 큰 기쁨이 됩니다. 화환은 정중히 사양하며, 부득이 참석이 어려우신 분들을 위해 마음 전하실 곳을 조심스레 안내해 드립니다.',
    accounts: [
      {
        role: '신랑측',
        holder: '김재현',
        bank: '신한은행',
        number: '110-429-881204',
      },
      {
        role: '신부측',
        holder: '정하은',
        bank: '국민은행',
        number: '482901-04-319205',
      },
    ],
  },
];
