import * as React from "react";
import * as _ from "lodash";

import {
  SearchBox,
  Hits,
  HitsStats,
  RefinementListFilter,
  Pagination,
  ResetFilters,
  MenuFilter,
  SelectedFilters,
  HierarchicalMenuFilter,
  NumericRefinementListFilter,
  SortingSelector,
  SearchkitComponent,
  SearchkitProvider,
  SearchkitManager,
  NoHits,
  RangeFilter,
  InitialLoader,
  ViewSwitcherToggle,
  ViewSwitcherHits
} from "searchkit";

import "searchkit/theming/theme.scss";

const MovieHitsGridItem = (props)=> {
  const {bemBlocks, result} = props
  let url = "http://www.imdb.com/title/" + result._source.imdbId
  const source:any = _.extend({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <a href={url} target="_blank">
        <img data-qa="poster" className={bemBlocks.item("poster")} src={result._source.poster} width="170" height="240"/>
        <div data-qa="title" className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.title}}>
        </div>
      </a>
    </div>
  )
}

const MovieHitsListItem = (props)=> {
  const {bemBlocks, result} = props
  let url = "http://www.imdb.com/title/" + result._source.imdbId
  const source:any = _.extend({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <div className={bemBlocks.item("poster")}>
        <img data-qa="poster" src={result._source.poster}/>
      </div>
      <div className={bemBlocks.item("details")}>
        <a href={url} target="_blank"><h2 className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.title}}></h2></a>
        <h3 className={bemBlocks.item("subtitle")}>Released in {source.year}, rated {source.imdbRating}/10</h3>
        <div className={bemBlocks.item("text")} dangerouslySetInnerHTML={{__html:source.plot}}></div>
      </div>
    </div>
  )
}

export class Demo3 extends React.Component<any, any> {

  searchkit:SearchkitManager

  constructor() {
    super()
    // new searchkit Manager connecting to ES server
    const host = "http://demo.searchkit.co/api/movies"
    this.searchkit = new SearchkitManager(host)
  }


  render(){

    return (
      <SearchkitProvider searchkit={this.searchkit}>
      <div>
        <div className="sk-layout sk-layout__size-l">

          <div className="sk-layout__top-bar sk-top-bar">
            <div className="sk-top-bar__content">

              <SearchBox
                autofocus={true}
                searchOnChange={true}
                queryFields={["title^5", "actors"]}
                />
            </div>
          </div>

          <div className="sk-layout__body">

            <div className="sk-layout__filters">
              <HierarchicalMenuFilter fields={["type.raw", "genres.raw"]} title="Categories" id="categories"/>
              <RangeFilter min={0} max={100} field="metaScore" id="metascore" title="Metascore" showHistogram={true}/>
              <RefinementListFilter id="actors" title="Actors" field="actors.raw" size={10}/>
              <NumericRefinementListFilter id="runtimeMinutes" title="Length" field="runtimeMinutes" options={[
                {title:"All"},
                {title:"up to 20", from:0, to:20},
                {title:"21 to 60", from:21, to:60},
                {title:"60 or more", from:61, to:1000}
              ]}/>
            </div>

      			<div className="sk-layout__results sk-results-list sk-results-list__no-filters">

              <div className="sk-results-list__action-bar sk-action-bar">

                <div className="sk-action-bar__info">
          				<HitsStats/>

                  <ViewSwitcherToggle/>

                  <SortingSelector options={[
                    {label:"Relevance", field:"_score", order:"desc",defaultOption:true},
                    {label:"Latest Releases", field:"released", order:"desc"},
                    {label:"Earliest Releases", field:"released", order:"asc"}
                  ]}/>

          			</div>

                <div className="sk-action-bar__filters">
                  <SelectedFilters/>
                  <ResetFilters/>
                </div>

              </div>

              <ViewSwitcherHits
      				    hitsPerPage={12}
                  highlightFields={["title", "plot"]}
                  sourceFilter={["plot", "title", "poster", "imdbId", "imdbRating", "year"]}
                  hitComponents = {[
                    {key:"grid", title:"Grid", itemComponent:MovieHitsGridItem, defaultOption:true},
                    {key:"list", title:"List", itemComponent:MovieHitsListItem}
                  ]}
              />

              <NoHits suggestionsField="title"/>

      			</div>
          </div>

    		</div>
      </div>
      </SearchkitProvider>
	)}

}
