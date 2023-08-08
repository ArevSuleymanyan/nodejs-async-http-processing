class ProcessedDataService {
  constructor() {
    this.processedData = new Map()
  }

  getData(id){
    return this.processedData.get(id)
  }

  setData(id, data){
    this.processedData.set(id, data)
  }
  removeData(id){
    this.processedData.delete(id)
  }
}

const processedData = new ProcessedDataService()
module.exports = {
  processedData
}
