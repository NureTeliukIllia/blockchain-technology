import { Inject, Injectable } from '@nestjs/common';
import Web3 from 'web3';

@Injectable()
export class Web3Service {
  constructor(
    @Inject('Web3')
    private readonly web3: Web3,
    @Inject('Config')
    private readonly config: { wallet: string; privateKey: string },
  ) {}

  public getWeb3(): Web3 {
    return this.web3;
  }

  public async balance() {
    const balance = await this.web3.eth.getBalance(this.config.wallet);
    return this.web3.utils.fromWei(balance, 'ether');
  }

  public async transfer(toWallet: string, value: number) {
    const gasPrice = await this.web3.eth.getGasPrice();
    const nonce = await this.web3.eth.getTransactionCount(
      this.config.wallet,
      'latest',
    );

    const transaction = {
      to: toWallet,
      value,
      gas: 200000,
      gasPrice,
      nonce,
    };

    const signedTx = await this.web3.eth.accounts.signTransaction(
      transaction,
      this.config.privateKey,
    );

    const tx = await this.web3.eth.sendSignedTransaction(
      signedTx.rawTransaction,
    );

    return tx.transactionHash;
  }
}
