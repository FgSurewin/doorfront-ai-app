import React from "react";
import Navbar from "../../components/Navbar";
import GoogleMap from "../../components/GoogleMap";
import ActionPanel from "../../components/ActionPanel";
import ImageDrawer from "./ImageDrawer";
import BadgeShowcase from "./BadgeShowcase";
import { Container, Grid, Paper, Stack, Typography } from "@mui/material";
import { generateInfo } from "../../components/GoogleMap/utils/streetViewTool";
import { debouncedStreetViewImageChange } from "./utils/debounceFunc";
import { useExplorationStore } from "../../global/explorationState";
import { useUpdateExplorationPage } from "../../hooks/useUpdateExploration";
import TreasureShowcase from "./TreasureShowcase";
import UserCreditShowcase from "./UserCreditShowcase";

export default function TestExploration() {
	/* ------------------------------ Global State ------------------------------ */
	const {
		googleMapConfig,
		streetViewImageConfig,
		updateGoogleMapConfig,
		updateStreetViewImageConfig,
		panoramaMarkerList,
		setIsNextPosition,
	} = useExplorationStore();

	/* -------------------------------------------------------------------------- */
	/*                                 Custom Hook                                */
	/* -------------------------------------------------------------------------- */
	const { handleNextPosition } = useUpdateExplorationPage();

	const onPovChanged = (
		result: ReturnType<typeof generateInfo>,
		map: google.maps.Map
	) => {
		debouncedStreetViewImageChange(result, updateStreetViewImageConfig);
	};

	const onPositionChanged = (
		result: ReturnType<typeof generateInfo>,
		map: google.maps.Map
	) => {
		debouncedStreetViewImageChange(result, updateStreetViewImageConfig);
		if (result.position && result.pov) {
			setIsNextPosition(false);
			updateGoogleMapConfig({
				panoId: result.pano,
				position: result.position,
				povConfig: { ...result.pov, zoom: result.zoom },
			});
		}
	};
	return (
		<div>
			<Navbar position="static" isTransparent={false} />
			<Paper
				id="ExplorationContainer"
				sx={{
					minHeight: "calc(100vh - 74px)",
					backgroundColor: "rgba(225, 207, 185, 0.15)",
					minWidth: "1440px",
				}}
			>
				<Container maxWidth="xl">
					<Grid container sx={{ pt: 10 }}>
						<Grid item xs={8} sx={{ minHeight: "640px", minWidth: "890px" }}>
							{googleMapConfig.panoId !== "" && (
								<GoogleMap
									streetViewEvents={{ onPovChanged, onPositionChanged }}
									mapConfig={{
										center: googleMapConfig.position,
										zoom: googleMapConfig.staticMapZoom,
									}}
									streetViewConfig={{
										pov: googleMapConfig.povConfig,
										position: googleMapConfig.position,
									}}
									streetViewMarkerList={panoramaMarkerList}
								/>
							)}
							<Stack direction="row" spacing={2}>
								<Typography variant="h6">
									Heading: {Math.round(streetViewImageConfig.imagePov.heading)}
								</Typography>
								<Typography variant="h6">
									Pitch: {Math.round(streetViewImageConfig.imagePov.pitch)}
								</Typography>
								<Typography variant="h6">
									Zoom: {Math.round(streetViewImageConfig.imagePov.zoom)}
								</Typography>
							</Stack>
						</Grid>
						<Grid item xs={4}>
							<BadgeShowcase />
							<UserCreditShowcase />
							<ActionPanel onNext={handleNextPosition} />
						</Grid>
					</Grid>
				</Container>
			</Paper>
			<ImageDrawer />
			<TreasureShowcase />
		</div>
	);
}
