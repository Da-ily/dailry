import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import * as S from './CommunityPage.styled';
import Button from '../../components/common/Button/Button';
import Text from '../../components/common/Text/Text';
import { getPost, postPosts, postEditedPosts } from '../../apis/postApi';
import { PATH_NAME } from '../../constants/routes';
import { getRequest } from '../../apis/dailryApi';

const CommunityWritePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  const pageImage = searchParams.get('pageImage');
  const postId = searchParams.get('postId');

  const [content, setContent] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const [writingTag, setWritingTag] = useState('');

  useEffect(() => {
    (async () => {
      if (type === 'edit') {
        const { data } = await getPost(postId);
        setContent(data.content);
        setHashtags(data.hashtags);
      }
    })();
  }, []);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleShareClick = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const request = new Blob(
      [JSON.stringify({ content, hashtags: [...hashtags, writingTag] })],
      {
        type: 'application/json',
      },
    );
    formData.append('request', request);

    const pageRequest = await getRequest(pageImage);
    const pageImageBlob = new Blob([pageRequest.data], { type: 'image/png' });
    formData.append('pageImage', await pageImageBlob);
    if (type === 'post') {
      await postPosts(await formData);
    }
    if (type === 'edit') {
      await postEditedPosts(postId, await formData);
    }
    navigate(PATH_NAME.CommunityList);
  };

  const handleWritingTagChange = (e) => {
    const tmpVal = e.target.value.replace(/^#/, '');
    if (tmpVal.includes(' ')) {
      const currentVal = tmpVal.trim();
      if (currentVal) {
        setHashtags([...hashtags, currentVal]);
      }
      return setWritingTag('');
    }
    return setWritingTag(tmpVal);
  };

  return (
    <S.PostWrapper>
      <S.DailryWrapper src={pageImage} />
      <S.WriteContentArea
        placeholder={'한줄설명'}
        value={content}
        onChange={handleContentChange}
      />
      <S.TagWrapper>
        <Text>태그</Text>
        {hashtags.map((hashtag) => (
          <Text key={Math.random()}>#{hashtag}</Text>
        ))}
        <S.WriteTagArea
          value={`#${writingTag}`}
          onChange={handleWritingTagChange}
        />
      </S.TagWrapper>
      <Button onClick={handleShareClick}>공유하기</Button>
    </S.PostWrapper>
  );
};

export default CommunityWritePage;
