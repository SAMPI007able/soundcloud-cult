import { useTheme } from '@mui/material/styles';

const useStyles = () => {
  const theme = useTheme()
  return {
    link: {
      fontFamily: 'Raleway, Arial',
      textDecoration: 'none',
      color: theme?.palette.primary.main,
      '&:hover': {
        textDecoration: 'underline',
      }
    },
    typography: {
      color: theme?.palette.secondary.main,
      textWrap: 'pretty'
    }
  }

};

export default useStyles;