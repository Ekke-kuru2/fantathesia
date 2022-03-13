function getInt(ar){
    var value = 0;
    for (var  i=0;i<ar.length;i++){
        value = (value << 8) + ar[i];
    }
    return value;
}
class loadMidi{ 
    constructor(){//input File
        
    }
    load(file){
        console.log(file);
        let reader= new FileReader();
        this.array={};
        reader.onload=()=>{
            this.array =new Uint8Array(reader.result);
            console.log(this.array)//1バイトずつ読める配列
            this._loadHeader();
        };
        reader.readAsArrayBuffer(file);
    }
    _loadHeader(){
        this.header={};
        //最初の4バイトがチャンクタイプ(4D 54 68 64)になっているかどうか(正しいmidiファイルか)
        if(this.array[0]==0x4D && this.array[1]==0x54 && this.array[2]==0x68 && this.array[3]==0x64 ){
            //5～8バイト目(ヘッダのバイト数を表す)を取得
            this.header.size = getInt(this.array.subarray(4,8));
            //SMFフォーマット
            this.header.format=this.array[9];

            //トラック数取得
            this.header.trackcount = getInt(this.array.subarray(10,12));

            //時間管理
            this.header.timemanage = this.array[12];

            //分解能
            this.header.resolution = getInt(this.array.subarray(12,14));
            console.log(this.header);
            this._loadBody();

        }else{
            console.log("error");
            if(typeof this.onerror == 'function'){
                this.onerror();
            }else{
                console.log("")
            }
        }
    }
    _loadBody(){
        let body=parseTracks(this.array.subarray(8+this.header.size,this.array.length));
        
    }
}


window.onload=()=>{

const debug=document.getElementById("debug");

document.getElementById("midiload").addEventListener('change',(e)=>{
    const mididata = new loadMidi();
    mididata.onload=()=>{
        console.log("midi loaded");
    };
    mididata.load(e.target.files[0]);
});

};