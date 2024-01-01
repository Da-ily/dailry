import * as S from '../LoginPage/LoginPage.styled';
import AuthButton from '../../components/common/AuthButton/AuthButton';

const RegisterDonePage = (props) => {
  const { nickname } = props;
  return (
    <S.LoginContainer>
      <Text size={24}>{nickname}님, 가입이 완료되었습니다!</Text>
      <AuthButton onClick={() => alert('로그인 페이지로')}>
        로그인 페이지로
      </AuthButton>
    </S.LoginContainer>
  );
};
