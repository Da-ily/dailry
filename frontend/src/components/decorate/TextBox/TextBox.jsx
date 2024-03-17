import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import * as S from './TextBox.styled';
import useDebounce from '../../../hooks/useDebounce';

const TextBox = (props) => {
  const { typeContent, setTypeContent } = props;

  const [text, setText] = useState('');
  const debouncedText = useDebounce(text, 600);
  const textRef = useRef(null);
  const [height, setHeight] = useState(typeContent?.current?.scrollHeight);

  useEffect(() => {
    setHeight(textRef?.current.scrollHeight);
  }, [textRef?.current?.scrollHeight]);

  useEffect(() => {
    if (typeContent?.text.length > 0) {
      setText(typeContent.text);
    }
  }, []);

  useEffect(() => {
    setTypeContent({ text: debouncedText });
  }, [debouncedText]);

  return (
    <S.TextArea
      ref={textRef}
      value={text}
      height={height}
      onChange={(e) => {
        setText(e.target.value);
      }}
    />
  );
};

TextBox.propTypes = {
  typeContent: PropTypes.string,
  setTypeContent: PropTypes.func,
};

export default TextBox;
