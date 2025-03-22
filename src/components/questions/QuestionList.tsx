import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Question } from "../../types/entities";
import useQuery from "../../hooks/useQuery";
import { PaginatedResponse } from "../../types/common";
import QuestionService from "../../services/questionService";
import GenericTable from "../common/Table";
import { createColumnHelper, PaginationState } from "@tanstack/react-table";

const columnHelper = createColumnHelper<Question>();

const columns = [
    columnHelper.accessor("id", {
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("body", {
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("score", {
        cell: (info) => info.getValue(),
    }),
];

const QuestionList = () => {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const { data, isPending, error } = useQuery<PaginatedResponse<Question>>(
        () => QuestionService.getAllQuestions(pagination),
        [pagination]
    );

    const [selectedRow, setSelectedRow] = useState<Question | null>(null);
    const [showModal, setShowModal] = useState(false);

    const handleRowClick = (row: Question) => {
        setSelectedRow(row);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedRow(null);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Questions</h2>
                <div>
                    <button className="btn btn-primary me-2">Add New</button>
                    <button className="btn btn-secondary">Export</button>
                </div>
            </div>

            <GenericTable<Question>
                data={data?.data ?? []}
                columns={columns}
                pagination={pagination}
                setPagination={setPagination}
                totalCount={data?.totalCount ?? 0}
                onRowClick={handleRowClick}
                isPending={isPending}
                error={error}
            />

            {/* Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Question Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRow ? (
                        <>
                            {console.log("selectedRow", selectedRow)}
                            <p>
                                <strong>ID:</strong> {selectedRow.id}
                            </p>
                            <p>
                                <strong>Body:</strong> {selectedRow.body}
                            </p>
                            <p>
                                <strong>Score:</strong> {selectedRow.score}
                            </p>
                        </>
                    ) : (
                        <p>No data available</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default QuestionList;
