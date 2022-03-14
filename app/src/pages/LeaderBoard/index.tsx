import React from "react";
import Navbar from "../../components/Navbar";
import {
	CssBaseline,
	Grid,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import { generateImageStyle } from "./LeaderBoard.style";
import { AllUserScores, getAllUsersFromDB } from "../../apis/user";
// import { fakeUserData } from "./data";
import _ from "lodash";

export default function LeaderBoard() {
	const [allUsers, setAllUsers] = React.useState<AllUserScores[]>([]);
	React.useEffect(() => {
		async function loadFunc() {
			const result = await getAllUsersFromDB();
			if (result.code === 0) {
				setAllUsers(_.orderBy(result.data, ["score"], ["desc"]));
			}
		}
		loadFunc();
	}, []);

	return (
		<div>
			<Navbar position="static" isTransparent={false} />
			<Grid container component="main" sx={{ height: "calc(100vh - 74px)" }}>
				<CssBaseline />
				<Grid
					item
					xs={12}
					sm={6}
					component={Paper}
					elevation={6}
					square
					sx={{ p: 2 }}>
					<Typography
						variant="h6"
						sx={{
							textAlign: "center",
							my: 2,
							color: "text.primary",
							fontWeight: "bold",
						}}>
						Welcome to leader board 🏆
					</Typography>
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
									<TableCell>{row.score}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					<Typography
						variant="body2"
						sx={{
							textAlign: "left",
							my: 1,
							color: "text.primary",
							fontSize: 12,
						}}>
						Showing the first 10 users
					</Typography>
				</Grid>
				<Grid item xs={false} sm={6} sx={generateImageStyle} />
			</Grid>
		</div>
	);
}
