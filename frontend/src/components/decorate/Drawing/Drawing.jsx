import { useRef } from 'react';
import PropTypes from 'prop-types';
import useDrawUtils from './useDrawUtils';
import AuthButton from '../../common/AuthButton/AuthButton';
import useDrawInstance from './useDrawInstance';

const Drawing = (props) => {
  const { id } = props;
  const canvas = useRef(null);

  const { drawInstance } = useDrawInstance(canvas);
  const {
    saveCanvas,
    mouseEventHandlers,
    startMoving,
    stopMoving,
    mode,
    setMode,
  } = useDrawUtils(canvas, drawInstance);

  return (
    <>
      <canvas
        id={id}
        onMouseDown={(e) => startMoving(e, mouseEventHandlers[mode])}
        onMouseUp={() => stopMoving(mouseEventHandlers[mode])}
        ref={canvas}
      ></canvas>

      <AuthButton onClick={() => saveCanvas()}>저장하기</AuthButton>

      <AuthButton onClick={() => setMode('drawMode')}>그리기</AuthButton>

      <AuthButton onClick={() => setMode('eraseMode')}>지우기</AuthButton>
      <input
        type="color"
        onChange={(e) => drawInstance.setColor(e.target.value)}
      />
      <input
        type="range"
        onChange={(e) => drawInstance.setSize(e.target.value)}
      />
    </>
  );
};

Drawing.propTypes = {
  id: PropTypes.string,
};

export default Drawing;
