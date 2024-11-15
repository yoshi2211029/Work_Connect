import ApartmentIcon from '@mui/icons-material/Apartment';
import NewspaperOutlinedIcon from '@mui/icons-material/NewspaperOutlined';
import VideoLibraryOutlinedIcon from '@mui/icons-material/VideoLibraryOutlined';
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';
import SvgColor from 'src/components/svg-color';

// 動かない
// import StickyNote2Icon from '@mui/icons-material/StickyNote2';
// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: '作品一覧',
    path: '/',
    icon: <TipsAndUpdatesOutlinedIcon />,
  },
  {
    title: '動画一覧',
    path: '/VideoList',
    icon: <VideoLibraryOutlinedIcon />,
  },
  {
    title: '学生一覧',
    path: '/StudentList',
    icon: icon('ic_student'),
  },
  {
    title: '企業一覧',
    path: '/CompanyList',
    icon: <ApartmentIcon />,
  },
  {
    title: 'ニュース一覧',
    path: '/Internship_JobOffer?page=JobOffer',
    icon: <NewspaperOutlinedIcon />,
  },
];

export default navConfig;
