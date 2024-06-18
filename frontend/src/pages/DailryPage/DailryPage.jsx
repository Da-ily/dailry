// Da-ily 회원, 비회원, 다일리 있을때, 없을때를 조건문으로 나눠서 렌더링
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import saveAs from 'file-saver';
import 'react-toastify/dist/ReactToastify.css';
import * as S from './DailryPage.styled';
import Text from '../../components/common/Text/Text';
import ToolButton from '../../components/ToolButton/ToolButton';
import {
  DECORATE_TOOLS,
  DECORATE_TOOLS_TOOLTIP,
  PAGE_TOOLS,
  PAGE_TOOLS_TOOLTIP,
} from '../../constants/toolbar';
import { postPage, patchPage, getPreviewPages } from '../../apis/dailryApi';
import { DECORATE_TYPE, EDIT_MODE } from '../../constants/decorateComponent';
import useNewDecorateComponent from '../../hooks/useNewDecorateComponent/useNewDecorateComponent';
import DecorateWrapper from '../../components/decorate/DecorateWrapper';
import TypedDecorateComponent from '../../components/decorate/TypedDecorateComponent';
import useEditDecorateComponent from '../../hooks/useEditDecorateComponent';
import useUpdatedDecorateComponents from '../../hooks/useUpdatedDecorateComponents';
import { TEXT } from '../../styles/color';
import MoveableComponent from '../../components/Moveable/Moveable';
import usePageData from '../../hooks/usePageData';
import { DecorateComponentDeleteButton } from '../../components/decorate/DeleteButton/DeleteButton.styled';
import Tooltip from '../../components/common/Tooltip/Tooltip';
import PageNavigator from '../../components/dailryPage/pageList/PageNavigator/PageNavigator';
import useDecorateComponents from '../../hooks/decorateComponent/useDecorateComponents';
// import { PATH_NAME } from '../../constants/routes';

const DailryPage = () => {
  const pageRef = useRef(null);
  const moveableRef = useRef([]);
  // const navigate = useNavigate();

  const [target, setTarget] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const [dailryData, setDailryData] = useState([]);
  // const [pageId, setPageId] = useState(0);

  const navigate = useNavigate();
  const params = useParams();
  const dailryId = Number(params.dailryId);
  const pageNumber = Number(params.pageNumber);

  const { decorateComponents, dispatchDecorateComponents } =
    useDecorateComponents();

  useEffect(() => {
    console.log(decorateComponents);
  }, [decorateComponents]);

  const {
    updatedDecorateComponents,
    setUpdatedDecorateComponents,
    addUpdatedDecorateComponent,
    modifyUpdatedDecorateComponent,
  } = useUpdatedDecorateComponents();

  const {
    newDecorateComponent,
    createNewDecorateComponent,
    setNewDecorateComponentTypeContent,
    completeCreateNewDecorateComponent,
  } = useNewDecorateComponent(
    decorateComponents,
    pageRef,
    dispatchDecorateComponents,
    addUpdatedDecorateComponent,
  );

  const {
    editMode,
    setEditMode,
    canEditDecorateComponent,
    setCanEditDecorateComponent,
    setCanEditDecorateComponentTypeContent,
    setCanEditDecorateComponentCommonProperty,
    completeModifyDecorateComponent,
  } = useEditDecorateComponent(
    dispatchDecorateComponents,
    modifyUpdatedDecorateComponent,
  );

  const { appendPageDataToFormData, formData } = usePageData(
    updatedDecorateComponents,
  );

  const isMoveable = () => target && editMode === EDIT_MODE.COMMON_PROPERTY;

  const [deletedDecorateComponentIds, setDeletedDecorateComponentIds] =
    useState([]);

  const deleteDecorateComponent = (id) => {
    if (!deletedDecorateComponentIds.some((d) => d.id === id)) {
      setDeletedDecorateComponentIds((prev) => [...prev, id]);
    }

    dispatchDecorateComponents({ type: 'delete', id });

    setTarget(null);
  };

  const patchPageData = () => {
    setTarget(null);

    setTimeout(async () => {
      const pageImg = await html2canvas(pageRef.current);

      pageImg.toBlob(async (pageImageBlob) => {
        appendPageDataToFormData(
          pageImageBlob,
          updatedDecorateComponents,
          deletedDecorateComponentIds,
        );
        const { pageId } = dailryData.pages.find(
          (page) => page.pageNumber === pageNumber,
        );
        await patchPage(pageId, formData);
      });

      setUpdatedDecorateComponents([]);
    }, 100);
  };

  useEffect(() => {
    if (canEditDecorateComponent) {
      completeModifyDecorateComponent();
      setTarget(null);
      setCanEditDecorateComponent(null);
    }

    if (newDecorateComponent) {
      completeCreateNewDecorateComponent();
    }

    setTimeout(() => {
      if (updatedDecorateComponents.length > 0) {
        patchPageData();
      }

      setUpdatedDecorateComponents([]);
    }, 1000);

    // setPageId(
    //   dailryData.length !== 0
    //     ? dailryData.pages.find((page) => page.pageNumber === pageNumber).pageId
    //     : 0,
    // );
  }, [pageNumber]);

  useEffect(() => {
    (async () => {
      if (dailryId) {
        const response = await getPreviewPages(dailryId);
        if (response.status === 200) {
          setDailryData(response.data);
        }
      }
    })();
  }, [dailryId]);

  const handleDownloadClick = async () => {
    try {
      const pageImg = await html2canvas(pageRef.current);
      pageImg.toBlob((pageImageBlob) => {
        if (pageImageBlob !== null) {
          saveAs(pageImageBlob, `dailry${dailryId}_${pageNumber}.png`);
        }
      });
    } catch (e) {
      console.error('이미지 변환 오류', e);
    }
  };

  const handleClickPage = (e) => {
    if (
      selectedTool === null ||
      (selectedTool === DECORATE_TYPE.MOVING && !canEditDecorateComponent)
    ) {
      return;
    }

    if (canEditDecorateComponent) {
      completeModifyDecorateComponent();
      setTarget(null);

      setCanEditDecorateComponent(null);
      return;
    }

    if (newDecorateComponent) {
      completeCreateNewDecorateComponent();
      return;
    }

    createNewDecorateComponent(e, selectedTool);
  };

  const handleClickDecorate = (e, index, element) => {
    e.stopPropagation();

    if (selectedTool === DECORATE_TYPE.MOVING) {
      setTarget(index + 1);
    }

    if (
      canEditDecorateComponent &&
      canEditDecorateComponent.id !== element.id
    ) {
      completeModifyDecorateComponent();
      setTarget(null);
      setCanEditDecorateComponent(null);
      return;
    }

    if (newDecorateComponent) {
      completeCreateNewDecorateComponent();

      return;
    }

    if (
      editMode === EDIT_MODE.COMMON_PROPERTY ||
      (editMode === EDIT_MODE.TYPE_CONTENT && selectedTool === element.type)
    ) {
      setCanEditDecorateComponent(element);
    }

    if (
      canEditDecorateComponent &&
      canEditDecorateComponent.id !== element.id
    ) {
      setTarget(null);
    }
  };
  return dailryId ? (
    <S.FlexWrapper>
      <S.CanvasWrapper ref={pageRef} onMouseDown={handleClickPage}>
        {decorateComponents?.map((element, index) => {
          const canEdit =
            editMode === EDIT_MODE.TYPE_CONTENT &&
            element.type === selectedTool &&
            canEditDecorateComponent?.id === element.id;
          return (
            <DecorateWrapper
              key={element.id}
              onMouseDown={(e) => handleClickDecorate(e, index, element)}
              setTarget={setTarget}
              index={index}
              canEdit={canEdit}
              ref={(el) => {
                moveableRef[index + 1] = el;
              }}
              {...element}
            >
              {(target === index + 1 ||
                canEditDecorateComponent?.id === element.id) && (
                <DecorateComponentDeleteButton
                  onClick={() => {
                    deleteDecorateComponent(element.id);
                  }}
                >
                  삭제
                </DecorateComponentDeleteButton>
              )}

              <TypedDecorateComponent
                type={element.type}
                typeContent={element.typeContent}
                canEdit={canEdit}
                setTypeContent={setCanEditDecorateComponentTypeContent}
              />
            </DecorateWrapper>
          );
        })}

        {newDecorateComponent && (
          <DecorateWrapper
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            canEdit
            {...newDecorateComponent}
          >
            <TypedDecorateComponent
              type={newDecorateComponent.type}
              canEdit
              setTypeContent={setNewDecorateComponentTypeContent}
            />
          </DecorateWrapper>
        )}
        {isMoveable() && (
          <MoveableComponent
            target={moveableRef[target]}
            setCommonProperty={setCanEditDecorateComponentCommonProperty}
          />
        )}
      </S.CanvasWrapper>
      <S.SideWrapper>
        <S.ToolWrapper>
          {DECORATE_TOOLS.map(({ icon, type }, index) => {
            const onSelect = (t) => {
              if (newDecorateComponent) {
                completeCreateNewDecorateComponent();
              }
              if (canEditDecorateComponent) {
                completeModifyDecorateComponent();
                setTarget(null);
                setCanEditDecorateComponent(null);
              }
              setSelectedTool(selectedTool === t ? null : t);
              if (t === DECORATE_TYPE.MOVING) {
                setEditMode(EDIT_MODE.COMMON_PROPERTY);
              } else {
                setEditMode(EDIT_MODE.TYPE_CONTENT);
              }
            };
            return (
              <Tooltip key={index} text={DECORATE_TOOLS_TOOLTIP[type]}>
                <ToolButton
                  icon={icon}
                  selected={selectedTool === type}
                  onSelect={() => onSelect(type)}
                />
              </Tooltip>
            );
          })}
          {PAGE_TOOLS.map(({ icon, type }, index) => {
            const onSelect = async (t) => {
              if (newDecorateComponent) {
                completeCreateNewDecorateComponent();
              }
              if (canEditDecorateComponent) {
                completeModifyDecorateComponent();
                setTarget(null);
                setCanEditDecorateComponent(null);
              }
              setSelectedTool(selectedTool === t ? null : t);
              setTimeout(() => {
                setSelectedTool(null);
              }, 150);
              if (t === 'add') {
                if (canEditDecorateComponent) {
                  completeModifyDecorateComponent();
                  setTarget(null);

                  setCanEditDecorateComponent(null);
                  return;
                }

                if (newDecorateComponent) {
                  completeCreateNewDecorateComponent();
                  return;
                }
                if (
                  updatedDecorateComponents.length > 0 &&
                  window.confirm(
                    '저장 하지 않은 꾸미기 컴포넌트가 존재합니다. 저장하시겠습니까?',
                  )
                ) {
                  patchPageData();
                }
                setUpdatedDecorateComponents([]);
                await postPage(dailryId);
              }
              if (t === 'download') {
                await handleDownloadClick();
              }
              if (t === 'save') {
                patchPageData();
              }
              if (t === 'share') {
                const currentPageThumbnail = dailryData.find(
                  (page) => page.pageNumber === pageNumber,
                ).thumbnail;
                navigate(
                  `${PATH_NAME.CommunityWrite}?type=post&pageImage=${currentPageThumbnail}`,
                );
              }
            };
            return (
              <Tooltip key={index} text={PAGE_TOOLS_TOOLTIP[type]}>
                <ToolButton
                  key={index}
                  icon={icon}
                  selected={selectedTool === type}
                  onSelect={() => onSelect(type)}
                />
              </Tooltip>
            );
          })}
        </S.ToolWrapper>
        <PageNavigator dailryData={dailryData} pageNumber={pageNumber} />
      </S.SideWrapper>
    </S.FlexWrapper>
  ) : (
    <S.NoCanvas>
      <Text size={30} weight={1000} color={TEXT.disabled}>
        다일리 또는 페이지를 선택하거나 만들어주세요
      </Text>
    </S.NoCanvas>
  );
};

export default DailryPage;
