import { components } from 'react-select';
import PropTypes from 'prop-types';
import Flag from 'react-world-flags';


export default function CustomMultiValue({ data, ...props }) {
  const { label, icon } = data;
  return (
    <components.MultiValue className="LanguagesSection__select-multi-value" {...props}>
      {icon && <Flag code={icon} className="LanguagesSection__select-multi-value__icon" />}
      {label}
    </components.MultiValue>
  );
}

CustomMultiValue.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string.isRequired,
    icon: PropTypes.string,
  }).isRequired,
};
