import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';

export const SidebarData = [
  {
    title: "HOME",
    icon: <HomeIcon />,
    link: "/"
  },
  {
    title: "Explore",  // 検索
    icon: <SearchIcon />,
    link: ""
  },
  {
    title: "Profile",
    icon: <PersonIcon />,
    link: ""
  },
  {
    title: "favorite",
    icon: <FavoriteIcon />,
    link: "/likes"
  },
]