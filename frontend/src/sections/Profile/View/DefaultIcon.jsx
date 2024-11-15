import PersonIcon from '@mui/icons-material/Person';
import PropTypes from 'prop-types';

const DefaultIcon = ({ sx = {} }) => {
  // デフォルトのスタイルを設定し、propsで渡されたsxを上書き
  const defaultStyle = {
    width: '40px',
    height: '40px',
    margin: '0 5px',
    borderRadius: '50%',
    backgroundColor: 'grey.400',
    color: 'white',
    padding: '5px',
    display: 'inline-block', // インラインブロックに設定して改行を防止
  };

  return (
    <PersonIcon sx={{ ...defaultStyle, ...sx }} /> // 上書きされたスタイルを反映
  );
};

// PropTypesでsxの型を定義
DefaultIcon.propTypes = {
    sx: PropTypes.object, // sxはオブジェクト型として指定
};

export default DefaultIcon;