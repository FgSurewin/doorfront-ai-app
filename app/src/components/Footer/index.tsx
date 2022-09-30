import React from "react";
import { Container, Divider, Grid, Typography, Box } from "@mui/material";
import { FooterData, LogoData } from "./data";
import { FooterList, LogoList } from "./Footer.style";

export default function Footer() {
	return (
		<Box component="div" sx={{ backgroundColor: "#484646", pt: 4 }}>
			<Container maxWidth="md">
				<Grid container direction="column" justifyContent="center">
					<LogoList data={LogoData} />
					<Divider sx={{ borderBottomWidth: 5, borderColor: "white", mb: 2 }} />
					<Grid item container justifyContent="center" spacing={4}>
						<Grid item>
							<FooterList
								listTitle={FooterData.project}
								list={FooterData.projectList}
							/>
						</Grid>
						<Grid item>
							<FooterList
								listTitle={FooterData.connect}
								list={FooterData.connectList}
							/>
						</Grid>
					</Grid>
					<Grid item sx={{ py: 2 }}>
						<Divider sx={{ borderBottomWidth: 5, borderColor: "white" }} />
					</Grid>
					<Grid item container justifyContent="center" sx={{ pb: 2 }}>
						<Typography variant="body2" sx={{ color: "white" }}>
							{FooterData.copyRight}
						</Typography>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
}
