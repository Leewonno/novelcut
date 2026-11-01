import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NewMain from '../newRouter/NewMain';
import { getPopularNovelList, getReconetNovelList } from '../newRouter/common/getData';

jest.mock('../newRouter/common/getData', () => ({ getPopularNovelList: jest.fn(), getReconetNovelList: jest.fn() }));

const setup = async () => {
  getReconetNovelList.mockResolvedValue([]);
  getPopularNovelList.mockResolvedValue([{ title: '인기작', genre: '로맨스', round: 2, cover_img: 'c.png' }]);
  render(<MemoryRouter><NewMain /></MemoryRouter>);
  await screen.findByText('01 / 02');
};

const tick = (ms) => act(() => { jest.advanceTimersByTime(ms); });
const hero = () => screen.getByRole('heading', { level: 1 });
// 슬라이드가 한 바퀴 돌아 제자리로 오는 경우도 잡도록 1초마다 확인한다
const expectStaysFor = (seconds, text) => {
  for (let i = 0; i < seconds; i++) {
    tick(1000);
    expect(hero()).toHaveTextContent(text);
  }
};

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

test('시간이 지나도 배너가 자동으로 넘어가지 않는다', async () => {
  await setup();
  expectStaysFor(30, '웹소설 공모전');
  expect(screen.getByText('01 / 02')).toBeInTheDocument();
});

test('다음 버튼으로 넘기고, 넘긴 뒤에도 그대로 머문다', async () => {
  await setup();
  fireEvent.click(screen.getByRole('button', { name: '다음 슬라이드' }));
  expect(hero()).toHaveTextContent('인기작');
  expect(screen.getByRole('link', { name: '첫 화 보기' })).toHaveAttribute('href', '/n/인기작/detail?round=1');
  expectStaysFor(30, '인기작');
});

test('이전 버튼은 첫 슬라이드에서 마지막 슬라이드로 돌아간다', async () => {
  await setup();
  fireEvent.click(screen.getByRole('button', { name: '이전 슬라이드' }));
  expect(hero()).toHaveTextContent('인기작');
  fireEvent.click(screen.getByRole('button', { name: '이전 슬라이드' }));
  expect(hero()).toHaveTextContent('웹소설 공모전');
});
