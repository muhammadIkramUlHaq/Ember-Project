/* eslint-disable ember/new-module-imports */
import Ember from 'ember';

export default Ember.Route.extend({
  async model() {
    let response = await fetch('https://api.october.eu/projects');
    let data = await response.json();

    let projects = data.projects;

    return projects.map((project) => {
      let {
        name,
        status,
        id,
        rate,
        summary,
        illustration,
        amount,
        grade,
        onlineDate,
        expirationDate,
        openingDate,
        loanDuration,
      } = project;
      //let summary_en = summary.map((s) => s.en.value);
      let summary_en = summary.en[0].value;

      let image = 'https://cdn.october.eu/' + illustration.url;
      let projectDurationLeft;
      let onlineStatus = status;

      return {
        name,
        status,
        id,
        rate,
        summary_en,
        image,
        grade,
        amount,
        expirationDate,
        loanDuration,
      };
    });
  },
});
