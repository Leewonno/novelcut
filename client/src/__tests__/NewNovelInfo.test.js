import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import NewNovelInfo from '../newRouter/NewNovelInfo';
import LoginStateContext from '../store/loginState-context';
import { getNovel, getStoryList } from '../newRouter/common/getData';

jest.mock('../newRouter/common/getData', () => ({ getNovel: jest.fn(), getStoryList: jest.fn() }));

const setup = async (writeName = '') => {
  getNovel.mockResolvedValue({ result: true, data: { title: '작품', write_name: '작가', genre: '로맨스', summary: '줄거리', cover_img: 'c.png' } });
  // Firestore는 문서 ID 문자열 순서로 돌려준다 ("1", "10", "2")
  getStoryList.mockResolvedValue([{ round: 1, title: '하나' }, { round: 10, title: '열' }, { round: 2, title: '둘' }]);
  render(
    <LoginStateContext.Provider value={{ writeName }}>
      <MemoryRouter initialEntries={['/n/작품']}>
        <Routes><Route path="/n/:id" element={<NewNovelInfo />} /></Routes>
      </MemoryRouter>
    </LoginStateContext.Provider>
  );
  await screen.findByText('10화');
};

const order = () => within(screen.getByRole('list')).getAllByRole('link').map((a) => a.getAttribute('href').split('round=')[1]);

test('회차는 숫자 기준 최신순으로 시작하고 첫화부터로 전환된다', async () => {
  await setup();
  expect(order()).toEqual(['10', '2', '1']);
  fireEvent.click(screen.getByRole('button', { name: '첫화부터' }));
  expect(order()).toEqual(['1', '2', '10']);
});

test('수정하기는 작가 본인에게만 보인다', async () => {
  await setup('작가');
  expect(screen.getByRole('link', { name: '수정하기' })).toHaveAttribute('href', '/create/detail?id=작품');
});

test('다른 사용자에게는 수정하기가 보이지 않는다', async () => {
  await setup('다른사람');
  expect(screen.queryByRole('link', { name: '수정하기' })).not.toBeInTheDocument();
});
