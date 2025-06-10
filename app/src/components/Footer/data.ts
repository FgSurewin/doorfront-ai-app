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
    { icon: InfoIcon, content: "About Us", link: "" },
    { icon: GavelIcon, content: "Term of Use", link: "" },
    { icon: BookIcon, content: "Labeling Guide", link: "" },
  ],
  connect: "connect",
  connectList: [
    {
      icon: GitHubIcon,
      content: "GitHub",
      link: "https://github.com/FgSurewin/doorfront-ai-app"
    },
    {
      icon: TwitterIcon,
      content: "Twitter",
      link: ""
    },
    {
      icon: EmailIcon,
      content: "Email",
      link: "mailto:doorfront.info@gmail.com"
    },
    // {
    //   icon: FacebookIcon,
    //   content: "Facebook",
    //   link: ""
    // },
  ],
  copyRight: `© 2024 Doorfront. All Rights Reserved.`,
};
