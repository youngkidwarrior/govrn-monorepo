import * as yup from 'yup';
import { ethers } from 'ethers';
import { splitEntriesByComma } from '../utils/arrays';
import { MAX_CSV_UPLOAD_SIZE, ADDRESS_IMPORT_MAX } from './constants';

// Helpers

export const isEthAddress = (item: unknown): item is `0x${string}` =>
  typeof item === 'string' && ethers.utils.isAddress(item);

export const listLength = (length: number, maxLength: number) =>
  maxLength >= length;

export const daoTextareaFormValidation = yup.object({
  guildName: yup.string().required('This field is required.'),
  daoMemberAddresses: yup
    .string()
    .min(1, 'Need to include at least one address.')
    .test('isEthAddress', 'Invalid addresses included in the list.', value => {
      if (value) {
        const parsedDaoMemberAddresses = splitEntriesByComma(value);
        return parsedDaoMemberAddresses.every(isEthAddress);
      }
      return false;
    })
    .test('listLength', 'Too many addresses in the list.', value => {
      if (value) {
        const parsedDaoMemberAddresses = splitEntriesByComma(value);
        return listLength(parsedDaoMemberAddresses.length, ADDRESS_IMPORT_MAX);
      }
      return false;
    })
    .required('This field is required.'),
});

export const daoMembersUpdateFormValidation = yup.object({
  daoMemberAddresses: yup
    .string()
    .min(1, 'Need to include at least one address.')
    .test('isEthAddress', 'Invalid addresses included in the list.', value => {
      if (value) {
        const parsedDaoMemberAddresses = splitEntriesByComma(value);
        return parsedDaoMemberAddresses.every(isEthAddress);
      }
      return false;
    })
    .required('This field is required.'),
});

export const daoCsvFormValidation = yup.object().shape({
  daoCsvFile: yup
    .mixed()
    .test('fileRequired', 'Need to provide a CSV.', value => {
      if (value.length > 0) {
        return true;
      }
      return false;
    })
    .test(
      'fileSize',
      `File is too large. Please limit to  ${Number(
        MAX_CSV_UPLOAD_SIZE / (1024 * 1024),
      ).toFixed(0)}mb`,
      value => {
        if (value[0]?.size <= MAX_CSV_UPLOAD_SIZE) {
          return true;
        }
        return false;
      },
    ),
});

export const profileFormValidation = yup.object({
  name: yup.string(),
});

export const linearFormValidation = yup.object({
  userLinearEmail: yup
    .string()
    .email('Please enter a valid email address.')
    .required('This field is required.'),
});

export const createUserFormValidation = yup.object({
  username: yup.string().required('This field is required.'),
});

export const createWaitlistFormValidation = yup
  .object({
    username: yup.string().required('This field is required.'),
    email: yup
      .string()
      .email('Please enter a valid email address.')
      .required('This field is required.'),
  })
  .required();

export const attestationFormValidation = yup.object({
  username: yup.string().required('This field is required.'),
});

export const editContributionFormValidation = yup.object({
  // username: yup.string().required('This field is required.'),
});

export const reportFormValidation = yup.object({
  name: yup.string().required('Contribution Name is required.'),
  engagementDate: yup.date().required('Engagement Date is required.'),
  activityType: yup.string().nullable().required('Activity Type is required.'),
});

export const addAttestationFormValidation = yup.object({
  // username: yup.string().required('This field is required.'),
});

// dao updates

export const daoNameFormValidation = yup.object({
  daoName: yup.string().required('DAO name is required.'),
});
