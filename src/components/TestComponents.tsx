import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import axios from "axios";
import { useState } from "react";
import { Alert, Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import Select from "react-select";

interface UserData {
    id: number;
    name: string;
    email: string;
}

const TestComponents = () => {
    // State for Select
    const [selectedOption, setSelectedOption] = useState<any>(null);

    // State for Table
    const [rowData] = useState<UserData[]>([
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" },
        { id: 3, name: "Bob Johnson", email: "bob@example.com" }
    ]);

    // State for API test
    const [apiResponse, setApiResponse] = useState<string>("");
    const [loading, setLoading] = useState(false);

    // Select options
    const options = [
        { value: "chocolate", label: "Chocolate" },
        { value: "strawberry", label: "Strawberry" },
        { value: "vanilla", label: "Vanilla" }
    ];

    // Define columns for TanStack Table
    const columns: ColumnDef<UserData>[] = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "name", header: "Name" },
        { accessorKey: "email", header: "Email" }
    ];

    // Initialize TanStack Table
    const table = useReactTable({
        data: rowData,
        columns,
        getCoreRowModel: getCoreRowModel()
    });

    // Test API call using axios
    const testApiCall = async () => {
        setLoading(true);
        try {
            const response = await axios.get("https://jsonplaceholder.typicode.com/users/1");
            setApiResponse(JSON.stringify(response.data, null, 2));
        } catch (error) {
            setApiResponse("Error fetching data");
        }
        setLoading(false);
    };

    return (
        <Container className="mt-4">
            <h1>Component Test Page</h1>

            {/* React-Bootstrap Test */}
            <Row className="mb-4">
                <Col>
                    <h3>React-Bootstrap Test</h3>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Example input</Form.Label>
                            <Form.Control type="text" placeholder="Enter text" />
                        </Form.Group>
                        <Button variant="primary">Test Button</Button>
                    </Form>
                </Col>
            </Row>

            {/* React-Select Test */}
            <Row className="mb-4">
                <Col>
                    <h3>React-Select Test</h3>
                    <Select value={selectedOption} onChange={setSelectedOption} options={options} className="mb-3" />
                    {selectedOption && <Alert variant="info">Selected: {selectedOption.label}</Alert>}
                </Col>
            </Row>

            {/* TanStack Table Test */}
            <Row className="mb-4">
                <Col>
                    <h3>TanStack Table Test</h3>
                    <Table striped bordered hover>
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th key={header.id}>
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>

            {/* Axios Test */}
            <Row className="mb-4">
                <Col>
                    <h3>Axios Test</h3>
                    <Button variant="success" onClick={testApiCall} disabled={loading} className="mb-3">
                        {loading ? "Loading..." : "Test API Call"}
                    </Button>
                    {apiResponse && <pre className="border p-3 bg-light">{apiResponse}</pre>}
                </Col>
            </Row>
        </Container>
    );
};

export default TestComponents;
