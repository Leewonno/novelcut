import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignupBox from '../organism/SignupBox';
import { postSignUp } from '../newRouter/common/postData';

jest.mock('../newRouter/common/postData', () => ({ postSignUp: jest.fn() }));

const setup = () => render(<MemoryRouter><SignupBox /></MemoryRouter>);

const answer = (placeholder, value) => {
  fireEvent.change(screen.getByPlaceholderText(placeholder), { target: { value } });
  fireEvent.click(screen.getByRole('button', { name: /^(다음|가입하기)$/ }));
};

const fillAll = () => {
  answer('아이디', 'reader@example.com');
  answer('비밀번호', 'abcd123!');
  answer('비밀번호 확인', 'abcd123!');
  answer('이름', '홍길동');
  answer('닉네임', '길동');
  answer('필명', '길동이');
};

beforeEach(() => postSignUp.mockReset());

test('아이디가 이메일 형식이 아니면 다음 단계로 넘어가지 않는다', () => {
  setup();
  answer('아이디', 'not-an-email');
  expect(screen.getByText('아이디는 이메일 형식으로 입력해주세요.')).toBeInTheDocument();
  expect(screen.getByText('1 / 6')).toBeInTheDocument();
});

test('비밀번호는 영문, 숫자, 특수문자를 포함해야 한다', () => {
  setup();
  answer('아이디', 'reader@example.com');
  answer('비밀번호', 'abcdefgh');
  expect(screen.getByText('비밀번호는 영문, 숫자, 특수문자를 포함해 8자 이상이어야 합니다.')).toBeInTheDocument();
  expect(screen.getByText('2 / 6')).toBeInTheDocument();
});

test('비밀번호 확인이 다르면 넘어가지 않는다', () => {
  setup();
  answer('아이디', 'reader@example.com');
  answer('비밀번호', 'abcd123!');
  answer('비밀번호 확인', 'different1!');
  expect(screen.getByText('비밀번호가 일치하지 않습니다.')).toBeInTheDocument();
});

test('이전 버튼으로 돌아가면 입력값이 유지된다', () => {
  setup();
  answer('아이디', 'reader@example.com');
  fireEvent.click(screen.getByRole('button', { name: '이전' }));
  expect(screen.getByPlaceholderText('아이디')).toHaveValue('reader@example.com');
});

test('마지막 단계에서 가입 요청을 보내고 완료 화면을 보여준다', async () => {
  postSignUp.mockResolvedValue(true);
  setup();
  fillAll();
  expect(await screen.findByText('길동님, 환영합니다')).toBeInTheDocument();
  expect(postSignUp).toHaveBeenCalledWith({
    email: 'reader@example.com',
    password: 'abcd123!',
    name: '홍길동',
    nick: '길동',
    write_name: '길동이',
  });
});

test('가입 요청이 실패하면 마지막 단계에 머문다', async () => {
  postSignUp.mockResolvedValue(false);
  setup();
  fillAll();
  await waitFor(() => expect(postSignUp).toHaveBeenCalled());
  await waitFor(() => expect(screen.getByRole('button', { name: '가입하기' })).toBeEnabled());
  expect(screen.getByText('6 / 6')).toBeInTheDocument();
  expect(screen.queryByText('길동님, 환영합니다')).not.toBeInTheDocument();
});
