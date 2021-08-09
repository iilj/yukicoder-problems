import { Contest } from '../interfaces/Contest';

export const OpenContests: Contest[] = [
  // https://www.hackerrank.com/75th
  // id: 97235
  // get_endtimeiso: "2020-03-19T14:00:00Z"
  // get_starttimeiso: "2020-03-19T11:30:00Z"
  {
    Id: -97235,
    Name: '灘校75回生中学卒業記念コンテスト (Open)',
    Date: '2020-03-19T20:30:00+09:00',
    EndDate: '2020-03-19T23:00:00+09:00',
    ProblemIdList: [
      4951, 4952, 4954, 4956, 4957, 4958, 4959, 4960, 4961, 4962, 4963, 4964,
      4965,
    ],
  },
  // https://www.hackerrank.com/epsf001
  // id: 69694
  // get_endtimeiso: "2019-10-14T08:30:00Z"
  // get_starttimeiso: "2019-10-14T04:30:00Z"
  // C,H,I,L,N,P,Qは欠番
  {
    Id: -69694,
    Name: 'Beginners After Typhoon Contest#01 (Open)',
    Date: '2019-10-14T13:30:00+09:00',
    EndDate: '2019-10-14T17:30:00+09:00',
    ProblemIdList: [
      4600, 4825, -1, 4560, 4748, 4826, 4827, -1, -1, 4776, 4777, -1, 4746, -1,
      4778, -1, -1, 4750,
    ],
  },
  // https://www.hackerrank.com/ysf1
  // id: 103804
  // get_endtimeiso: "2020-06-17T13:30:00Z"
  // get_starttimeiso: "2020-06-17T12:00:00Z"
  {
    Id: -103804,
    Name: 'YSF Beginner Contest (Open)',
    Date: '2020-06-17T21:00:00+09:00',
    EndDate: '2020-06-17T22:30:00+09:00',
    ProblemIdList: [4573, 4572, 4571, 4570, 4569, 4568, 4567],
  },
];
