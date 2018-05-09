import { Parser } from 'html-to-react';

export default class ReactMustache extends React.Component {
	compileTempate(template, data) {
		return Mustache.render(template,data);
	}
	
	render() {
		const { template, data } = this.props;
		
		if(!template) {
			return '';
		}
		
		const html = compileTemplate(
		
		return ({
			(new Parser()).parse(html);
		}); 
	}
}

ReactMustache.defaultProps = {
	data: {}
}
