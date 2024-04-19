import GitHubIcon from "@mui/icons-material/GitHub";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import EmailIcon from "@mui/icons-material/Email";
import InfoIcon from "@mui/icons-material/Info";
import GavelIcon from "@mui/icons-material/Gavel";
import BookIcon from "@mui/icons-material/Book";
import NSFLogo from "../../images/NSF_LOGO.png";
import GoogleLogo from "../../images/GOOGLE_LOGO.png";
import CUNYLogo from "../../images/CUNY_LOGO.jpg";
import PSYLogo from "../../images/PSC_LOGO.svg";

export const FooterData = {
	project: "project",
	projectList: [
		{ icon: InfoIcon, content: "About Us" },
		{ icon: GavelIcon, content: "Term of Use" },
		{ icon: BookIcon, content: "Labeling Guide" },
	],
	connect: "connect",
	connectList: [
		{
			icon: GitHubIcon,
			content: "GitHub",
		},
		{
			icon: TwitterIcon,
			content: "Twitter",
		},
		{
			icon: EmailIcon,
			content: "Email",
		},
		{
			icon: FacebookIcon,
			content: "Facebook",
		},
	],
	copyRight: `© 2024 Doorfront. All Rights Reserved.`,
};

export const LogoData = [
	{ img: NSFLogo, link: "https://www.nsf.gov/", width: "70%" },
	{ img: GoogleLogo, link: "https://www.google.com/", width: "80%" },
	{ img: CUNYLogo, link: "https://www.cuny.edu/", width: "80%" },
	{ img: PSYLogo, link: "https://psc-cuny.org/", width: "70%" },
];
