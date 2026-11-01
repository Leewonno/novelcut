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

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

test('6초마다 다음 슬라이드로 넘어간다', async () => {
  await setup();
  tick(6000);
  expect(hero()).toHaveTextContent('인기작');
  expect(screen.getByRole('link', { name: '첫 화 보기' })).toHaveAttribute('href', '/n/인기작/detail?round=1');
});

test('마우스가 올라가 있으면 넘어가지 않고, 벗어나면 다시 시작한다', async () => {
  await setup();
  fireEvent.mouseEnter(hero());
  tick(20000);
  expect(hero()).toHaveTextContent('웹소설 공모전');
  fireEvent.mouseLeave(hero());
  tick(6000);
  expect(hero()).toHaveTextContent('인기작');
});

test('수동으로 넘기면 타이머가 처음부터 다시 시작한다', async () => {
  await setup();
  tick(5000);
  fireEvent.click(screen.getByRole('button', { name: '다음 슬라이드' }));
  expect(hero()).toHaveTextContent('인기작');
  tick(5000);
  expect(hero()).toHaveTextContent('인기작');
  tick(1000);
  expect(hero()).toHaveTextContent('웹소설 공모전');
});
