import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import NewNovel from '../newRouter/NewNovel';
import { getStory } from '../newRouter/common/getData';

jest.mock('../newRouter/common/getData', () => ({ getStory: jest.fn() }));
jest.mock('../newRouter/common/updateData', () => ({ updateNovelView: jest.fn() }));

const story = (round, novelRound) => ({
  data: { title: `${round}화 제목`, round, content: '첫째 줄\n\n둘째 줄\n셋째 줄', writer_comment: '읽어주셔서 감사합니다' },
  novel: { round: novelRound },
});

const setup = async (round, novelRound) => {
  getStory.mockResolvedValue(story(round, novelRound));
  render(
    <MemoryRouter initialEntries={[`/n/작품/detail?round=${round}`]}>
      <Routes><Route path="/n/:id/detail" element={<NewNovel />} /></Routes>
    </MemoryRouter>
  );
  await screen.findByText('첫째 줄');
};

test('다음 버튼과 슬라이더로 페이지를 이동한다', async () => {
  await setup(1, 2);
  expect(screen.getByText('1 / 3')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '다음 페이지' }));
  expect(screen.getByText('둘째 줄')).toBeInTheDocument();
  fireEvent.change(screen.getByRole('slider'), { target: { value: '3' } });
  expect(screen.getByText('셋째 줄')).toBeInTheDocument();
  expect(screen.getByText('3 / 3')).toBeInTheDocument();
});

test('방향키로 이동하되 양 끝을 넘지 않는다', async () => {
  await setup(1, 2);
  fireEvent.keyDown(window, { key: 'ArrowLeft' });
  expect(screen.getByText('1 / 3')).toBeInTheDocument();
  fireEvent.keyDown(window, { key: 'ArrowRight' });
  expect(screen.getByText('2 / 3')).toBeInTheDocument();
});

test('작가의 말은 마지막 페이지에서만 보인다', async () => {
  await setup(1, 2);
  expect(screen.queryByText('읽어주셔서 감사합니다')).not.toBeInTheDocument();
  fireEvent.change(screen.getByRole('slider'), { target: { value: '3' } });
  expect(screen.getByText('읽어주셔서 감사합니다')).toBeInTheDocument();
});

test('회차 위치에 따라 이전화/다음화 링크를 보여준다', async () => {
  await setup(2, 3);
  expect(screen.getByRole('link', { name: '이전화' })).toHaveAttribute('href', '/n/작품/detail?round=1');
  expect(screen.getByRole('link', { name: '다음화' })).toHaveAttribute('href', '/n/작품/detail?round=3');
});

test('첫 회차에는 이전화가, 마지막 회차에는 다음화가 없다', async () => {
  await setup(1, 1);
  expect(screen.queryByRole('link', { name: '이전화' })).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: '다음화' })).not.toBeInTheDocument();
});
