import GitHubIcon from "@mui/icons-material/GitHub";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import EmailIcon from "@mui/icons-material/Email";
import InfoIcon from "@mui/icons-material/Info";
import GavelIcon from "@mui/icons-material/Gavel";
import BookIcon from "@mui/icons-material/Book";

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
  copyRight: `© 2021 Doorfront. All Rights Reserved.`,
};
