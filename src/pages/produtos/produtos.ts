import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';
import { API_CONFIG } from '../../config/api.config';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items: ProdutoDTO[] = [];

  page: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public produtoService: ProdutoService,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this.loadData();
  };

  loadData(){
    let categoria_id = this.navParams.get('categoria_id');
    let loader = this.presentLoading();
    this.produtoService.findByCategoria(categoria_id, this.page, 10)
      .subscribe(response => {
        let start = this.items.length;
        this.items = this.items.concat(response['content']);
        let end = this.items.length - 1;
        loader.dismiss();
        this.loadImageUrls(start, end);
      },
      error => {
        loader.dismiss();
      });
  }

  loadImageUrls(start : number, end : number){
    for(var i=start; i<=end; i++ ){
        let item = this.items[i];
        this.produtoService.getSmallImageFromBucket(item.id)
           .subscribe(response => {
            item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`;
           },
           error => {});
    }
  }

  showDetail(produto_id : string){
    this.navCtrl.push('ProdutoDetailPage', {produto_id: produto_id});
  }

  presentLoading() {
    let loading = this.loadingCtrl.create({
      content: 'Aguarde...',
    });
    loading.present();
    return loading;
  }

  doRefresh(refresher){
    this.page = 0;
    this.loadData();
    setTimeout(() =>{
      refresher.complete();
  }, 1000);
  }

  doInfinite(infineteScroll){
    this.page++;
    this.loadData();
    setTimeout(() =>{
      infineteScroll.complete();
  }, 1000);
  }
}
