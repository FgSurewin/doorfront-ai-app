import React from "react";
import { AllUserScores, getAllUsersFromDB } from "../../apis/user";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";
import _ from "lodash";

export default function LeaderBoard() {

    const [allUsers, setAllUsers] = React.useState<AllUserScores[]>([]);
    React.useEffect(() => {
        async function loadFunc() {
            const result = await getAllUsersFromDB();
            if (result.code === 0) {
                setAllUsers(_.orderBy(result.data, ["contestScore"], ["desc"]));
            }
        }
        loadFunc();
    }, []);


    return (
        <div>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow
                        sx={{
                            bgcolor: "primary.main",
                        }}>
                        {["Rank", "Username", "Score"].map((item, index) => (
                            <TableCell
                                key={index}
                                sx={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
                                {item}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {allUsers.slice(0, 10).map((row, index) => (
                        <TableRow
                            key={row.email}
                            sx={{
                                "&:nth-of-type(odd)": {
                                    backgroundColor: "action.hover",
                                },
                                // hide last border
                                "&:last-child td, &:last-child th": {
                                    border: 0,
                                },
                            }}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{row.username}</TableCell>
                            <TableCell>{row.contestScore}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}