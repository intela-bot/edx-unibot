import { components } from 'react-select';
import PropTypes from 'prop-types';
import Flag from 'react-world-flags';


export default function CustomOption({ data, ...props }) {
  const { label, icon } = data;
  return (
    <components.Option className="LanguagesSection__select-option" {...props}>
      {icon && <Flag code={icon} className="LanguagesSection__select-option__icon" />}
      {label}
    </components.Option>
  );
}

CustomOption.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string.isRequired,
    icon: PropTypes.string,
  }).isRequired,
};
