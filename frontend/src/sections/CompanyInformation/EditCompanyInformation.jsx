import { useState } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";


//MUIアイコン
import Tooltip from '@mui/material/Tooltip';
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import Switch from '@mui/material/Switch';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import Paper from '@mui/material/Paper';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from "@mui/material/Typography";

import "./CompanyInformation.css"





const modalStyle = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // オーバーレイの背景色
        zIndex: 2, // オーバーレイの z-index
        width: '110%',
        height: '100%',
    },
    content: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        border: 'none',
        borderRadius: '0',
        padding: '1.5rem',
        zIndex: 2, // コンテンツの z-index
        overflow: 'hidden',
        width:'50%'
    },
};

const SortableRow = ({ id, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : 'none',
        transition,
        cursor: isDragging ? 'grabbing' : 'grab',
    };

    return (
        <div ref={setNodeRef} style={style} className="DragSortContainer" {...attributes}>
            {/* ドラッグ用のアイコンを個別のコンテナに */}
            <div className="DragIcon" {...listeners}>
                <Tooltip title={"ドラッグすることで並び替えができます"}>
                    <SwapVertIcon style={{ cursor: 'grab' }} />
                </Tooltip>
            </div>
            {/* 子要素（Accordion）が別スタイルとして表示されるようにする */}
            <div className="AccordionWrapper">
                {children}
            </div>
        </div>
    );
};

SortableRow.propTypes = {
    id: PropTypes.number.isRequired,
    children: PropTypes.node.isRequired,
};

SortableRow.propTypes = {
    id: PropTypes.number.isRequired,
    children: PropTypes.func.isRequired,
};



const EditCompanyInformation = ({
    IsOpen,
    CloseModal,
    editedContents,
    HandlePublicStatusChange,
    HandleAddRow,
    HandleDragEnd,
    HandleDelete,
    HandleTextChange
}) => {

    const [expanded, setExpanded] = useState(false);

    const AccordionhandleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };


    return (
        <Modal
            isOpen={IsOpen}
            onRequestClose={CloseModal} // モーダルを閉じるコールバック
            shouldCloseOnOverlayClick={true} // オーバーレイクリックでモーダルを閉じる
            contentLabel="Example Modal"
            style={modalStyle}
        >
            <div>
                <div className="modal_overlay">
                    <div className="modal_window">
                        <TableContainer component={Paper} className="Modal_tableContainer">

                            <Table className="Modal_Table">
                                <TableHead className="FixedTableHead">

                                    <Button variant="outlined" onClick={CloseModal} className="CloseButton">
                                        閉じる
                                    </Button>

                                </TableHead>
                                <TableBody className="EditCompanyInformationTableBody">
                                    <DndContext modifiers={[restrictToVerticalAxis]} collisionDetection={closestCenter} onDragEnd={HandleDragEnd}>
                                        <SortableContext items={editedContents.map(item => item.id)} strategy={verticalListSortingStrategy}>
                                            {editedContents.map((item, index) => (
                                                <SortableRow key={item.id} id={item.id}>
                                                    <>
                                                        <Accordion
                                                            key={item.id}
                                                            expanded={expanded === item.id}
                                                            onChange={AccordionhandleChange(item.id)}
                                                            className="EditCompanyInformation-Accordion"
                                                        >
                                                            <AccordionSummary
                                                                expandIcon={<ExpandMoreIcon />}
                                                                aria-controls={`${item.id}-content`}
                                                                id={`${item.id}-header`}
                                                            >
                                                                <Typography sx={{ width: '70%', flexShrink: 0 }}>{item.title}:{item.contents}</Typography>
                                                            </AccordionSummary>
                                                            <AccordionDetails>
                                                            <input
                                                                type="text"
                                                                value={item.title}
                                                                onChange={(e) => HandleTextChange(index, "title", e.target.value)}
                                                                className="EditTitle"
                                                            />
                                                            <textarea
                                                                value={item.contents}
                                                                onChange={(e) => HandleTextChange(index, "contents", e.target.value)}
                                                                className="EditContents"
                                                            />
                                                            <Tooltip title={item.public_status === 1 ? "公開状態を切り替えます 現在:公開中" : "公開状態を切り替える 現在:非公開中"}>
                                                                <Switch
                                                                    checked={item.public_status === 1}
                                                                    onChange={() => HandlePublicStatusChange(index)}
                                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                                />
                                                            </Tooltip>
                                                            <Tooltip title={"開いているフォームを削除します"}>
                                                                <IconButton onClick={() => HandleDelete(index)}>
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title={"次の行に新たにフォームを追加します"}>
                                                                <IconButton onClick={() => HandleAddRow(index)}>
                                                                    <AddCircleOutlineIcon />
                                                                </IconButton>
                                                            </Tooltip>

                                                            </AccordionDetails>
                                                        </Accordion>
                                                    </>
                                                </SortableRow>
                                            ))}
                                        </SortableContext>
                                    </DndContext>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

EditCompanyInformation.propTypes = {
    IsOpen: PropTypes.bool.isRequired,
    CloseModal: PropTypes.func.isRequired,
    editedContents: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            contents: PropTypes.string.isRequired,
            company_name: PropTypes.string.isRequired,
            id: PropTypes.number.isRequired,
            company_id: PropTypes.string.isRequired,
        })
    ).isRequired,
    HandlePublicStatusChange: PropTypes.func.isRequired,
    HandleAddRow: PropTypes.func.isRequired,
    HandleDragEnd: PropTypes.func.isRequired,
    HandleDelete: PropTypes.func.isRequired,
    HandleTextChange: PropTypes.func.isRequired
};

export default EditCompanyInformation;
