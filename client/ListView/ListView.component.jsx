import React from 'react'

const ListView = props => {
  const {rowTemplate, parentTemplate, dataSource, ...others} = props
  const children = dataSource.map(rowTemplate)
  
  return parentTemplate({children, ...others})  
}

export default ListView
