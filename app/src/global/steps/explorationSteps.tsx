import { Box, Typography } from "@mui/material";
import { Step } from "react-joyride";

const sampleMarkerId = "sampleMarker";

export const explorationSteps: Step[] = [
	{
		content: (
			<Box>
				<Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
					🎉Welcome to exploration page
				</Typography>
				<Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
					With DoorFront, you can virtually walk through the entire city of New
					York and help us label every accessible storefront. The work you do
					helps not only your own community, but the city as a whole. I really
					appreciate your passion for helping. 😊
				</Typography>
				<Typography variant="body1" sx={{ textAlign: "left" }}>
					🥰 Now, Let me guild you through the workflow
				</Typography>
			</Box>
		),
		placement: "center",
		target: ".ExplorationWrapper",
		disableCloseOnEsc: true,
		disableOverlayClose: true,
		showSkipButton: true,
		hideCloseButton: true,
		spotlightClicks: false,
	},
	{
		content: (
			<Box>
				<Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
					🏬 Google Street View
				</Typography>
				<Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
					😀 This is our main interactive area that you can{" "}
					<strong>rotate and move</strong> to anywhere. Just like you would
					normally do with regular Google Street View.
				</Typography>
				<Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
					(🤫 You can try all these functions after the guild tour.)
				</Typography>
			</Box>
		),
		placement: "auto",
		target: ".StreetViewContainer",
		isFixed: true,
		disableCloseOnEsc: true,
		disableOverlayClose: true,
		showSkipButton: true,
		hideCloseButton: true,
		spotlightClicks: false,
	},
	{
		content: (
			<Box>
				<Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
					🗺️ Google Map
				</Typography>
				<Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
					😀 Instead of click embedded arrow key to move, you can control
					<strong>(drag/drop)</strong> the yellow figure to quickly move across
					street.
				</Typography>
				<Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
					😄 Moreover, you can click fullscreen button to see boarder area.
				</Typography>
				<Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
					(🤫 You can try all these functions after the guild tour.)
				</Typography>
			</Box>
		),
		placement: "auto",
		target: ".MapContainer",
		isFixed: true,
		disableCloseOnEsc: true,
		disableOverlayClose: true,
		showSkipButton: true,
		hideCloseButton: true,
		spotlightClicks: false,
	},
	// {
	// 	content: (
	// 		<Box>
	// 			<Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
	// 				🏷️ Label Marker
	// 			</Typography>
	// 			<Typography
	// 				variant="body1"
	// 				sx={{
	// 					mb: 2,
	// 					textAlign: "left",
	// 					color: "darkred",
	// 					fontWeight: "bold",
	// 				}}
	// 			>
	// 				😀 Please click the purple marker!
	// 			</Typography>
	// 		</Box>
	// 	),
	// 	placement: "auto",
	// 	target: `#${sampleMarkerId}`,
	// 	isFixed: true,
	// 	disableCloseOnEsc: true,
	// 	disableOverlayClose: true,
	// 	showSkipButton: true,
	// 	hideCloseButton: true,
	// 	spotlightClicks: true,
	// 	hideFooter: false,
	// },
	// {
	// 	content: (
	// 		<Box>
	// 			<Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
	// 				🗃️ Label Card
	// 			</Typography>
	// 			<Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
	// 				😀 You can check all the information within this label card
	// 			</Typography>
	// 		</Box>
	// 	),
	// 	placement: "auto",
	// 	target: `.${sampleMarkerId}-streetViewMarkerCard`,
	// 	isFixed: true,
	// 	disableCloseOnEsc: true,
	// 	disableOverlayClose: true,
	// 	showSkipButton: true,
	// 	hideCloseButton: true,
	// 	spotlightClicks: false,
	// 	hideBackButton: true,
	// },
	// {
	// 	content: (
	// 		<Box>
	// 			<Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
	// 				🗃️ Preview Image
	// 			</Typography>
	// 			<Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
	// 				😀 The <strong>bounding box</strong> corresponding to the label is
	// 				also shown on the preview image.
	// 			</Typography>
	// 			<Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
	// 				🤪 If you found the <strong>bounding box is incorrect</strong>, you
	// 				can correct it by clicking <strong>view button</strong>. (I will
	// 				introduce this button later)
	// 			</Typography>
	// 		</Box>
	// 	),
	// 	placement: "auto",
	// 	target: `.${sampleMarkerId}-CardMedia`,
	// 	isFixed: true,
	// 	disableCloseOnEsc: true,
	// 	disableOverlayClose: true,
	// 	showSkipButton: true,
	// 	hideCloseButton: true,
	// 	spotlightClicks: false,
	// },
	// {
	// 	content: (
	// 		<Box>
	// 			<Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
	// 				🗃️ Card Content
	// 			</Typography>
	// 			<Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
	// 				😀 You can see the <strong>image name, type and subtype</strong> of
	// 				current label within this section. In addition, the{" "}
	// 				<strong>username</strong> that annotated this label is displayed.
	// 			</Typography>
	// 		</Box>
	// 	),
	// 	placement: "auto",
	// 	target: `.${sampleMarkerId}-CardContent`,
	// 	isFixed: true,
	// 	disableCloseOnEsc: true,
	// 	disableOverlayClose: true,
	// 	showSkipButton: true,
	// 	hideCloseButton: true,
	// 	spotlightClicks: false,
	// },
	// {
	// 	content: (
	// 		<Box>
	// 			<Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
	// 				❌ Close Button
	// 			</Typography>
	// 			<Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
	// 				😀 Close the label card by clicking this button
	// 			</Typography>
	// 		</Box>
	// 	),
	// 	placement: "auto",
	// 	target: `.${sampleMarkerId}-CardActions`,
	// 	isFixed: true,
	// 	disableCloseOnEsc: true,
	// 	disableOverlayClose: true,
	// 	showSkipButton: true,
	// 	hideCloseButton: true,
	// 	spotlightClicks: false,
	// },
	// {
	// 	content: (
	// 		<Box>
	// 			<Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
	// 				🎞️ Image List
	// 			</Typography>
	// 			<Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
	// 				😀 When you see a border, it means that this image corresponds to the{" "}
	// 				<strong>label</strong> you clicked on.
	// 			</Typography>
	// 		</Box>
	// 	),
	// 	placement: "auto",
	// 	target: `.imageListItem`,
	// 	isFixed: true,
	// 	disableCloseOnEsc: true,
	// 	disableOverlayClose: true,
	// 	showSkipButton: true,
	// 	hideCloseButton: true,
	// 	spotlightClicks: false,
	// 	hideBackButton: true,
	// },
	// {
	// 	content: (
	// 		<Box>
	// 			<Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
	// 				🖱️ Image Button
	// 			</Typography>
	// 			<Typography
	// 				variant="body1"
	// 				sx={{ mb: 2, textAlign: "left", color: "darkblue" }}
	// 			>
	// 				😀 There are two status with this button
	// 			</Typography>
	// 			<Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
	// 				🔒 <strong>LOCKED</strong>: the current status indicates that you are
	// 				unable to modify the image. The reason may be that{" "}
	// 				<strong>
	// 					(1) you created the image, (2) you have modified the image before,
	// 					or (3) the image has been determined to be correct and does not need
	// 					to be modified.
	// 				</strong>
	// 			</Typography>
	// 			<Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
	// 				⭕ <strong>VIEW</strong>: the current status indicates that you can
	// 				modify this image to correct the incorrect labels you found.
	// 			</Typography>
	// 		</Box>
	// 	),
	// 	placement: "auto",
	// 	target: `.imageListItemButton`,
	// 	isFixed: true,
	// 	disableCloseOnEsc: true,
	// 	disableOverlayClose: true,
	// 	showSkipButton: true,
	// 	hideCloseButton: true,
	// 	spotlightClicks: false,
	// },
	// {
	// 	content: (
	// 		<Box>
	// 			<Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
	// 				🖱️ Validate Button
	// 			</Typography>
	// 			<Typography
	// 				variant="body1"
	// 				sx={{ mb: 2, textAlign: "left", color: "darkblue" }}
	// 			>
	// 				😀When you check all labels within the same image and feel that they
	// 				are 100% correct, you can click this button to validate them.
	// 			</Typography>
	// 			<Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
	// 				⭕ <strong>Reminder: </strong>: Please check all the labels carefully
	// 				before you click validate button.
	// 			</Typography>
	// 		</Box>
	// 	),
	// 	placement: "auto",
	// 	target: `.reviewImageButton`,
	// 	isFixed: true,
	// 	disableCloseOnEsc: true,
	// 	disableOverlayClose: true,
	// 	showSkipButton: true,
	// 	hideCloseButton: true,
	// 	spotlightClicks: false,
	// },
	{
		content: (
			<Box>
				<Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
					✨ Badge and Ranking System
				</Typography>
				<Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
					🔮 Credits mechanism: there are 4 ways to earn credits
				</Typography>
				<Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
					✅ Query image: add 1 point
				</Typography>
				<Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
					✅ Correct(Modify) other's labels: add 1 point
				</Typography>
				<Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
					✅ Validate other's labels: add 1 point
				</Typography>
				<Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
					☑️ Find treasures: add 10 points
				</Typography>
				<Typography
					variant="body1"
					sx={{
						mb: 2,
						textAlign: "left",
						color: "darkred",
						fontWeight: "bold",
					}}
				>
					🔥 Friendly reminder: DoorFront has buried many treasures in New York
					City, find them and earn extra points. The more pictures you query,
					the better your chances of finding the treasure. Take action,
					adventurers!
				</Typography>
			</Box>
		),
		placement: "auto",
		target: `.BadgeShowcase`,
		isFixed: true,
		disableCloseOnEsc: true,
		disableOverlayClose: true,
		showSkipButton: true,
		hideCloseButton: true,
		spotlightClicks: false,
	},
	{
		content: (
			<Box>
				<Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
					✨ Showcase of User Score
				</Typography>
				<Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
					🔮 The user credit system is based on the number of images
				</Typography>
				<Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
					🔥 When you capture, modify or validate image, you will gain one
					credit
				</Typography>
			</Box>
		),
		placement: "auto",
		target: `.UserCreditShowcase`,
		isFixed: true,
		disableCloseOnEsc: true,
		disableOverlayClose: true,
		showSkipButton: true,
		hideCloseButton: true,
		spotlightClicks: false,
	},
	{
		content: (
			<Box>
				<Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
					📷 Query Button
				</Typography>
				<Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
					😀 When you click this button, DoorFront will query image from Google
					based on viewing angle <strong>(Heading, Pitch and Zoom)</strong>
				</Typography>
				<Typography
					variant="body1"
					sx={{
						mb: 2,
						textAlign: "left",
						color: "darkred",
						fontWeight: "bold",
					}}
				>
					🤖 The queried image will be sent to our AI model to perform a
					pre-labeling process, which takes 20-30 seconds. During this process,
					you cannot query new images, but you can still control Google Street
					View to find another suitable storefront.
				</Typography>
			</Box>
		),
		placement: "auto",
		target: `.queryButton`,
		isFixed: true,
		disableCloseOnEsc: true,
		disableOverlayClose: true,
		showSkipButton: true,
		hideCloseButton: true,
		spotlightClicks: false,
	},
	{
		content: (
			<Box>
				<Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
					🖼️ Image Drawer
				</Typography>
				<Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
					😀 When you click this button, a <strong>drawer</strong> pops up and
					you can browse through all the query images.
				</Typography>
			</Box>
		),
		placement: "auto",
		target: `.ImageDrawer`,
		isFixed: true,
		disableCloseOnEsc: true,
		disableOverlayClose: true,
		showSkipButton: true,
		hideCloseButton: true,
		spotlightClicks: false,
	},
	{
		content: (
			<Box>
				<Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
					📦 Label Button
				</Typography>
				<Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
					😀 You will navigate to <strong>Labeling Page</strong> when you click
					this button
				</Typography>
				<Typography
					variant="body1"
					sx={{
						mb: 2,
						textAlign: "left",
						color: "darkred",
						fontWeight: "bold",
					}}
				>
					😔 (Label button is not allow to click if there is no query images
					(drawer is empty).)
				</Typography>
			</Box>
		),
		placement: "auto",
		target: `.labelButton`,
		isFixed: true,
		disableCloseOnEsc: true,
		disableOverlayClose: true,
		showSkipButton: true,
		hideCloseButton: true,
		spotlightClicks: false,
	},
	{
		content: (
			<Box>
				<Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
					⏭️ Next Position Button
				</Typography>
				<Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
					😀 When you click this button, you will be drop to a random location.
				</Typography>
			</Box>
		),
		placement: "auto",
		target: `.nextButton`,
		isFixed: true,
		disableCloseOnEsc: true,
		disableOverlayClose: true,
		showSkipButton: true,
		hideCloseButton: true,
		spotlightClicks: false,
	},
	{
		content: (
			<Box>
				<Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
					🎉 Congrats!
				</Typography>
				<Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
					😀 You already knew all the functions we have, now it's time to
					explore the New York City.
				</Typography>
				<Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
					🧐 Go, brave adventurers!
				</Typography>
			</Box>
		),
		placement: "center",
		target: `body`,
		isFixed: true,
		disableCloseOnEsc: true,
		disableOverlayClose: true,
		showSkipButton: true,
		hideCloseButton: true,
		spotlightClicks: false,
	},
];
