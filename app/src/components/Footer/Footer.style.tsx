import {
	Button,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	SvgIconTypeMap,
	Typography,
	Stack,
	Box,
} from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import React from "react";

export interface FooterListItemType {
	icon: OverridableComponent<SvgIconTypeMap>;
	content: string;
}

export interface FooterListProps {
	list: FooterListItemType[];
	listTitle: string;
}

export const FooterList = React.memo(function ({
	list,
	listTitle,
}: FooterListProps) {
	return (
		<>
			<Typography
				variant="subtitle1"
				component="div"
				sx={{
					textTransform: "uppercase",
					textAlign: "center",
					color: "white",
					fontWeight: "bold",
				}}
			>
				{listTitle}
			</Typography>
			<List dense>
				{list.map((item, index) => {
					const IconComponent = item.icon;
					return (
						<ListItem key={index}>
							<Button>
								<ListItemIcon sx={{ color: "white" }}>
									<IconComponent />
								</ListItemIcon>
								<ListItemText
									primary={item.content}
									sx={{ color: "white", "&:hover": { color: "primary.main" } }}
								/>
							</Button>
						</ListItem>
					);
				})}
			</List>
		</>
	);
});

export interface LogoListProps {
	data: { img: string; link: string; width: string }[];
}

export const LogoList = React.memo(function ({ data }: LogoListProps) {
	return (
		<Stack
			direction={{ xs: "column", sm: "row" }}
			justifyContent="space-around"
			alignItems={{ xs: "space-around", sm: "center" }}
			spacing={2}
			sx={{ py: 2 }}
		>
			{data.map((logo, index) => (
				<Box
					key={index}
					component="a"
					href={logo.link}
					target="_blank"
					sx={{ textAlign: "center", flex: { sm: 1 } }}
				>
					<Box
						component="img"
						src={logo.img}
						alt={"logo" + index}
						width={index === 1 ? "70%" : "60%"}
					/>
				</Box>
			))}
		</Stack>
	);
});
