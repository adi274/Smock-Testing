import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { ethers } from "hardhat";
import { FakeContract, smock, MockContractFactory, MockContract } from '@defi-wonderland/smock';
import { BigNumber } from "ethers";
import {expect} from 'chai'
import chai = require('chai')

import {
Lock,
Lock__factory
} from '../typechain-types'

describe("Testing Mock", async () => {
  var myMock: MockContract<Lock>;
  let owner:any;
  let otherAccount: any;  
  const HashID = 0;
  const ONE_GWEI = 1_000_000_000;
  let mockLockFactory: MockContractFactory<Lock__factory>

  before(async() => {
     mockLockFactory = await smock.mock("Lock");

  })

  beforeEach("Setup", async () => {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;

    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;
    myMock = await mockLockFactory.deploy(unlockTime, {
      value: ONE_GWEI
    });
   
  })
  describe("get", () => {
    it("should mock the Lock", async () => {

      expect(
        myMock.connect(owner).withdraw()
      ).to.be.revertedWith("something went wrong");

      expect(
        myMock.claim(HashID, ethers.constants.HashZero, {value: ONE_GWEI})
      ).to.be.reverted;

      // await myMock.withdraw()
    })
  })
})





