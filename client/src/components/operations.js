import '../css/operations.css';
import {
    Collapse,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Spinner,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useDisclosure,
} from "@chakra-ui/react";
// import map from "../res/map.svg";
import { useContext, useEffect, useState } from "react";
// import { IoClose } from 'react-icons/io5'
import { BsCheck, BsTelephone } from "react-icons/bs";
import { Appcontext } from './context';
const TableBtn = (props) => {
    var type = props.type;
    return (
        <button className={`px-2 py-3 ${type === 1 ? "text-[#095E97] bg-[#CFECFF]" : type === 0 ? "text-[#FF8A00] bg-[#FFE9CE]" : type === 2 ? "text-[#2B6877] bg-[#92E3A966]" : ""} uppercase`}>{props.type === 2 ? "COMPLETED" : props.type === 1 ? "DISPATCHED" : props.type === 0 ? "TBD" : ""}</button>
    );
};
const TableBody = (props) => {
    console.log(props);
    const [status, setStatus] = useState(props.status || 0);
    // const updateStatusFn_ = props.updateStatusFn2;
    var priority = props.priority || null;
    var onclickevent = props.onClick || "";
    const { changeID, setChangeID, changeStatus, setChangeStatus } = useContext(Appcontext);
    if (onclickevent === "") {
        onclickevent = function () { return; };
    }
    const onUpdateStatus = (id, st) => {
        if (!window.confirm("Are you sure want to update the status?")) {
            return;
        }
        setStatus(st);
        setChangeID(id);
        setChangeStatus(st);
        // updateStatusFn_(id,st);
    };
    return (
        <>
            <Tr className="hover:bg-[#f1f1f1] duration-100 cursor-pointer" onClick={onclickevent}>
                <Td>
                    <div
                        className={`uppercase ${priority === "high" ? "bg-[#FE0A0A]" : priority === "medium" ? "bg-[#FF8A00]" : priority === "low" ? "bg-green-700" : ""} text-center text-white font-semibold w-fit px-2 py-2 rounded-full`}
                    >
                        {props.priority}
                    </div>
                </Td>

                <Td>
                    <Menu>
                        <MenuButton>
                            <TableBtn type={status} />
                        </MenuButton>
                        <MenuList>
                            <MenuItem
                                onClick={() => {
                                    onUpdateStatus(props._key, 0);
                                }}
                            >
                                <div className="flex gap-2 items-center justify-between w-full px-2">
                                    <TableBtn type={0}>tbd</TableBtn>
                                    {status === 0 ? <BsCheck className="text-3xl" /> : ""}
                                </div>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    onUpdateStatus(props._key, 1);
                                }}
                            >
                                <div className="flex gap-2 items-center justify-between w-full px-2">
                                    <TableBtn type={1}>Dispatched</TableBtn>
                                    {status === 1 ? (
                                        <BsCheck className="text-3xl" />
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    onUpdateStatus(props._key, 2);
                                }}
                            >
                                <div className="flex gap-2 items-center justify-between w-full px-2">
                                    <TableBtn type={2}>completed</TableBtn>
                                    {status === 2 ? (
                                        <BsCheck className="text-3xl" />
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Td>
            </Tr>
        </>
    );
};
const OperationsPage = (props) => {
    // console.log(props);
    const [section, setSection] = useState("unresolved");

    const data = props.operationsData;
    console.log(data);
    const [filteredData, setFilteredData] = useState([]);
    const [ongoingCount, setOngoingCount] = useState(0);
    const [unresolvedCount, setUnresolvedCount] = useState(0);
    const [resolvedCount, setResolvedCount] = useState(0);
    const updateStatusFn = props.updatebtn;

    useEffect(() => {
        let ongoing = 0;
        let unresolved = 0;
        let resolved = 0;

        data.forEach((item) => {
            if (item.status === 0) {
                unresolved++;
            } else if (item.status === 1) {
                ongoing++;
            } else if (item.status === 2) {
                resolved++;
            }
        });

        setOngoingCount(ongoing);
        setUnresolvedCount(unresolved);
        setResolvedCount(resolved);
    }, [data, section]);

    useEffect(() => {
        setFilteredData(
            data.filter((item) => {
                if (section === "unresolved") {
                    return item.status === 0;
                } else if (section === "ongoing") {
                    return item.status === 1;
                } else if (section === "resolved") {
                    return item.status === 2;
                }
                return true;
            })
        );
    }, [data, section]);


    function ContentLoadwID(){

    }
    return (
        <div>
            <div className="lg:m-12 m-6 md:m-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex flex-col gap-6">

                        <div onClick={() => { setSection('unresolved') }} className={`bg-${section === "unresolved" ? '[#E9F9EE] border-black' : 'white'} border-[1px] py-3 px-16 rounded-xl hover:border-black hover:bg-[#E9F9EE] duration-200 cursor-pointer`}>
                            <div className="flex flex-col gap-3 text-center">
                                <h1 className="text-lg">Unresolved</h1>
                                <p className="text-xl font-semibold">{unresolvedCount}</p>
                            </div>
                        </div>
                        <div onClick={() => { setSection('ongoing') }} className={`bg-${section === "ongoing" ? '[#E9F9EE] border-black' : 'white'} border-[1px] py-3 px-16 rounded-xl hover:border-black hover:bg-[#E9F9EE] duration-200 cursor-pointer`}>
                            <div className="flex flex-col gap-3 text-center">
                                {/* <h1 className="text-lg">Unresolved</h1> */}
                                <h1 className="text-lg">Ongoing</h1>
                                {/* <p className="text-xl font-semibold">{unresolvedCount}</p> */}
                                <p className="text-xl font-semibold">{ongoingCount}</p>
                            </div>
                        </div>
                        <div onClick={() => { setSection('resolved') }} className={`bg-${section === "resolved" ? '[#E9F9EE] border-black' : 'white'} border-[1px] py-3 px-16 rounded-xl hover:border-black hover:bg-[#E9F9EE] duration-200 cursor-pointer`}>
                            <div className="flex flex-col gap-3 text-center">
                                <h1 className="text-lg">Resolved</h1>
                                <p className="text-xl font-semibold">{resolvedCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="bg-slate-900 py-4 rounded-xl">
                            <TableContainer>
                                <Table variant="simple">
                                    <Thead>
                                        <Tr>
                                            <Th>Priority</Th>
                                            {/* <Th></Th>
                                            <Th></Th>
                                            <Th></Th>
                                            <Th></Th> */}
                                            <Th>Status</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {filteredData.map((item) => (
                                            <TableBody
                                                _key={item.id}
                                                priority={item.data}
                                                // callerName={item.name}
                                                // callerNumber={item.phone}
                                                // emergency={item.attention}
                                                // location={item.location}
                                                // time={item.time}
                                                // status={item.status}
                                                // updateStatusFn2={updateStatusFn}
                                                // onClick={() => {  ContentLoadwID(item.id); }}
                                            />
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};
export default OperationsPage;
